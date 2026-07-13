'use strict';

const express = require('express');

const inventoryController = require('../controllers/inventory.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const inventoryValidators = require('../middleware/validators/inventory.validators');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Inventory alerts (must come before :id route)
router.get(
  '/alerts/low-stock',
  authorize('admin', 'receptionist'),
  inventoryController.getLowStockItems,
);

router.get(
  '/alerts/out-of-stock',
  authorize('admin', 'receptionist'),
  inventoryController.getOutOfStockItems,
);

router.get(
  '/alerts/expiring',
  authorize('admin', 'receptionist'),
  inventoryController.getExpiringItems,
);

router.get(
  '/alerts/expired',
  authorize('admin', 'receptionist'),
  inventoryController.getExpiredItems,
);

// Inventory stats
router.get(
  '/stats',
  authorize('admin', 'receptionist'),
  inventoryController.getInventoryStats,
);

// Inventory by category
router.get(
  '/category/:category',
  authorize('admin', 'receptionist'),
  inventoryValidators.validateCategory,
  validate,
  inventoryController.getInventoryByCategory,
);

// CRUD routes for inventory items
router.post(
  '/',
  authorize('admin', 'receptionist'),
  inventoryValidators.createInventory,
  validate,
  inventoryController.createInventoryItem,
);

router.get(
  '/',
  authorize('admin', 'receptionist'),
  inventoryController.getInventoryItems,
);

router.get(
  '/:id',
  authorize('admin', 'receptionist'),
  inventoryValidators.validateInventoryId,
  validate,
  inventoryController.getInventoryItemById,
);

router.put(
  '/:id',
  authorize('admin', 'receptionist'),
  inventoryValidators.validateInventoryId,
  inventoryValidators.updateInventory,
  validate,
  inventoryController.updateInventoryItem,
);

router.put(
  '/:id/quantity',
  authorize('admin', 'receptionist'),
  inventoryValidators.validateInventoryId,
  inventoryValidators.updateQuantity,
  validate,
  inventoryController.updateQuantity,
);

router.delete(
  '/:id',
  authorize('admin', 'receptionist'),
  inventoryValidators.validateInventoryId,
  validate,
  inventoryController.deleteInventoryItem,
);

module.exports = router;
