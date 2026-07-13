'use strict';

const inventoryService = require('../services/inventory.service');
const { sendSuccess, paginationMeta } = require('../utils/apiResponse');

/**
 * Create a new inventory item.
 * @route POST /api/inventory
 */
const createInventoryItem = async (req, res, next) => {
  try {
    const itemData = req.body;
    const userId = req.user._id || req.user.id;

    const item = await inventoryService.createInventoryItem(itemData, userId);

    return sendSuccess(res, 201, 'Inventory item created successfully.', item);
  } catch (error) {
    next(error);
  }
};

/**
 * Get inventory items with filtering.
 * @route GET /api/inventory
 */
const getInventoryItems = async (req, res, next) => {
  try {
    const { page, limit, search, category, status, sort } = req.query;

    const { items, total, page: currentPage, limit: currentLimit } = await inventoryService.getInventoryItems({
      page,
      limit,
      search,
      category,
      status,
      sort,
    });

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, 'Inventory items retrieved successfully.', items, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single inventory item by ID.
 * @route GET /api/inventory/:id
 */
const getInventoryItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await inventoryService.getInventoryItemById(id);

    return sendSuccess(res, 200, 'Inventory item details retrieved successfully.', item);
  } catch (error) {
    next(error);
  }
};

/**
 * Update inventory item details.
 * @route PUT /api/inventory/:id
 */
const updateInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const item = await inventoryService.updateInventoryItem(id, updateData);

    return sendSuccess(res, 200, 'Inventory item updated successfully.', item);
  } catch (error) {
    next(error);
  }
};

/**
 * Update inventory quantity.
 * @route PUT /api/inventory/:id/quantity
 */
const updateQuantity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantityChange, reason = 'adjustment' } = req.body;

    const item = await inventoryService.updateQuantity(id, quantityChange, reason);

    return sendSuccess(res, 200, 'Inventory quantity updated successfully.', item);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete inventory item (soft delete).
 * @route DELETE /api/inventory/:id
 */
const deleteInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await inventoryService.deleteInventoryItem(id);

    return sendSuccess(res, 200, 'Inventory item deleted successfully.', item);
  } catch (error) {
    next(error);
  }
};

/**
 * Get low stock items.
 * @route GET /api/inventory/alerts/low-stock
 */
const getLowStockItems = async (req, res, next) => {
  try {
    const items = await inventoryService.getLowStockItems();

    return sendSuccess(res, 200, 'Low stock items retrieved successfully.', items);
  } catch (error) {
    next(error);
  }
};

/**
 * Get out of stock items.
 * @route GET /api/inventory/alerts/out-of-stock
 */
const getOutOfStockItems = async (req, res, next) => {
  try {
    const items = await inventoryService.getOutOfStockItems();

    return sendSuccess(res, 200, 'Out of stock items retrieved successfully.', items);
  } catch (error) {
    next(error);
  }
};

/**
 * Get expiring items.
 * @route GET /api/inventory/alerts/expiring
 */
const getExpiringItems = async (req, res, next) => {
  try {
    const items = await inventoryService.getExpiringItems();

    return sendSuccess(res, 200, 'Expiring items retrieved successfully.', items);
  } catch (error) {
    next(error);
  }
};

/**
 * Get expired items.
 * @route GET /api/inventory/alerts/expired
 */
const getExpiredItems = async (req, res, next) => {
  try {
    const items = await inventoryService.getExpiredItems();

    return sendSuccess(res, 200, 'Expired items retrieved successfully.', items);
  } catch (error) {
    next(error);
  }
};

/**
 * Get inventory statistics.
 * @route GET /api/inventory/stats
 */
const getInventoryStats = async (req, res, next) => {
  try {
    const stats = await inventoryService.getInventoryStats();

    return sendSuccess(res, 200, 'Inventory statistics retrieved successfully.', stats);
  } catch (error) {
    next(error);
  }
};

/**
 * Get inventory by category.
 * @route GET /api/inventory/category/:category
 */
const getInventoryByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const { items, total, page: currentPage, limit: currentLimit } = await inventoryService.getInventoryByCategory(
      category,
      { page, limit },
    );

    const meta = paginationMeta(total, currentPage, currentLimit);

    return sendSuccess(res, 200, `${category} inventory items retrieved successfully.`, items, meta);
  } catch (error) {
    next(error);
  }
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
