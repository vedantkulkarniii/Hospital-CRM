'use strict';

const Inventory = require('../models/Inventory');
const logger = require('../utils/logger');

/**
 * Inventory Service — all inventory management business logic.
 */

/**
 * Create a new inventory item (T-166).
 * @param {object} itemData - Inventory item details
 * @param {string} userId - ID of the user creating the item
 * @returns {Promise<Inventory>}
 */
const createInventoryItem = async (itemData, userId) => {
  const item = await Inventory.create({
    ...itemData,
    addedBy: userId,
  });

  await item.populate('addedBy', 'firstName lastName email');

  logger.info(`Inventory item created: ${item.itemCode} - ${item.itemName}`);
  return item;
};

/**
 * Get inventory items with filtering and pagination (T-167).
 * @param {object} queryOptions - { page, limit, search, category, status, sort }
 * @returns {Promise<{ items, total, page, limit }>}
 */
const getInventoryItems = async ({
  page = 1,
  limit = 10,
  search = '',
  category,
  status,
  sort = '-createdAt',
}) => {
  const query = {};

  // Apply filters
  if (category) {
    query.category = category;
  }

  if (status) {
    query.status = status;
  }

  if (search) {
    const cleanSearch = search.trim();
    query.$or = [
      { itemCode: { $regex: cleanSearch, $options: 'i' } },
      { itemName: { $regex: cleanSearch, $options: 'i' } },
      { description: { $regex: cleanSearch, $options: 'i' } },
    ];
  }

  // Calculate pagination
  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  // Execute query
  const [items, total] = await Promise.all([
    Inventory.find(query)
      .populate('addedBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit),
    Inventory.countDocuments(query),
  ]);

  return {
    items,
    total,
    page: parsedPage,
    limit: parsedLimit,
  };
};

/**
 * Get inventory item by ID (T-168).
 * @param {string} id - Inventory MongoDB ID
 * @returns {Promise<Inventory>}
 */
const getInventoryItemById = async (id) => {
  const item = await Inventory.findById(id).populate('addedBy', 'firstName lastName email');

  if (!item) {
    const error = new Error('Inventory item not found.');
    error.statusCode = 404;
    throw error;
  }

  return item;
};

/**
 * Update inventory item (T-169).
 * @param {string} id - Inventory MongoDB ID
 * @param {object} updateData - Updated item details
 * @returns {Promise<Inventory>}
 */
const updateInventoryItem = async (id, updateData) => {
  const item = await Inventory.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('addedBy', 'firstName lastName');

  if (!item) {
    const error = new Error('Inventory item not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Inventory item updated: ${item.itemCode}`);
  return item;
};

/**
 * Update inventory quantity (consume/restock).
 * @param {string} id - Inventory MongoDB ID
 * @param {number} quantityChange - Positive for restock, negative for consumption
 * @param {string} reason - Reason for change (restock, consumed, adjustment)
 * @returns {Promise<Inventory>}
 */
const updateQuantity = async (id, quantityChange, reason = 'adjustment') => {
  const item = await Inventory.findById(id);

  if (!item) {
    const error = new Error('Inventory item not found.');
    error.statusCode = 404;
    throw error;
  }

  const previousQuantity = item.quantity;
  item.quantity = Math.max(0, item.quantity + quantityChange);

  // Track consumption
  if (quantityChange < 0) {
    item.totalConsumed = (item.totalConsumed || 0) + Math.abs(quantityChange);
    item.lastConsumedDate = new Date();
  }

  // Track restock
  if (quantityChange > 0 && reason === 'restock') {
    item.lastRestockDate = new Date();
    item.lastRestockQuantity = quantityChange;
  }

  await item.save();

  logger.info(
    `Inventory ${reason}: ${item.itemCode} - Quantity: ${previousQuantity} → ${item.quantity}`,
  );
  return item;
};

/**
 * Delete an inventory item (soft delete).
 * @param {string} id - Inventory MongoDB ID
 * @returns {Promise<Inventory>}
 */
const deleteInventoryItem = async (id) => {
  const item = await Inventory.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedAt: new Date(),
    },
    { new: true },
  );

  if (!item) {
    const error = new Error('Inventory item not found.');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Inventory item soft deleted: ${item.itemCode}`);
  return item;
};

/**
 * Get low stock items (T-170).
 * @returns {Promise<array>}
 */
const getLowStockItems = async () => {
  return Inventory.find({
    $expr: { $lte: ['$quantity', '$minThreshold'] },
    isActive: true,
  })
    .sort({ quantity: 1 })
    .populate('addedBy', 'firstName lastName');
};

/**
 * Get out of stock items.
 * @returns {Promise<array>}
 */
const getOutOfStockItems = async () => {
  return Inventory.find({
    quantity: 0,
    isActive: true,
  }).populate('addedBy', 'firstName lastName');
};

/**
 * Get expiring items (expiring within 30 days).
 * @returns {Promise<array>}
 */
const getExpiringItems = async () => {
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  return Inventory.find({
    expiryDate: { $gte: today, $lte: thirtyDaysFromNow },
    isActive: true,
  })
    .sort({ expiryDate: 1 })
    .populate('addedBy', 'firstName lastName');
};

/**
 * Get expired items.
 * @returns {Promise<array>}
 */
const getExpiredItems = async () => {
  return Inventory.find({
    expiryDate: { $lt: new Date() },
    isActive: true,
  }).populate('addedBy', 'firstName lastName');
};

/**
 * Get inventory statistics.
 * @returns {Promise<object>}
 */
const getInventoryStats = async () => {
  const stats = await Inventory.aggregate([
    {
      $match: { isDeleted: false },
    },
    {
      $group: {
        _id: null,
        totalItems: { $sum: 1 },
        totalQuantity: { $sum: '$quantity' },
        totalValue: { $sum: { $multiply: ['$quantity', '$costPrice'] } },
        lowStockCount: {
          $sum: {
            $cond: [
              { $lte: ['$quantity', '$minThreshold'] },
              1,
              0,
            ],
          },
        },
        outOfStockCount: {
          $sum: { $cond: [{ $eq: ['$quantity', 0] }, 1, 0] },
        },
        byCategory: {
          $push: {
            category: '$category',
            count: 1,
          },
        },
      },
    },
  ]);

  return stats.length > 0
    ? stats[0]
    : {
      totalItems: 0,
      totalQuantity: 0,
      totalValue: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      byCategory: [],
    };
};

/**
 * Get inventory by category.
 * @param {string} category - Category name
 * @param {object} options - { page, limit }
 * @returns {Promise<{ items, total }>}
 */
const getInventoryByCategory = async (category, { page = 1, limit = 10 } = {}) => {
  const query = { category };

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const [items, total] = await Promise.all([
    Inventory.find(query)
      .populate('addedBy', 'firstName lastName')
      .sort('-createdAt')
      .skip(skip)
      .limit(parsedLimit),
    Inventory.countDocuments(query),
  ]);

  return { items, total, page: parsedPage, limit: parsedLimit };
};

module.exports = {
  createInventoryItem,
  getInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  updateQuantity,
  deleteInventoryItem,
  getLowStockItems,
  getOutOfStockItems,
  getExpiringItems,
  getExpiredItems,
  getInventoryStats,
  getInventoryByCategory,
};
