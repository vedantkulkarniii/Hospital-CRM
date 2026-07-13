'use strict';

const { body, param } = require('express-validator');

/**
 * Inventory Validators — reusable validation chains for inventory operations.
 */

const inventoryValidators = {
  /**
   * Validate inventory item creation
   */
  createInventory: [
    body('itemName')
      .notEmpty().withMessage('Item name is required.')
      .trim()
      .isLength({ max: 100 }).withMessage('Item name cannot exceed 100 characters.'),
    body('category')
      .optional()
      .isIn([
        'medication',
        'medical_supplies',
        'equipment',
        'lab_materials',
        'consumables',
        'office_supplies',
        'other',
      ])
      .withMessage('Invalid category.'),
    body('quantity')
      .notEmpty().withMessage('Quantity is required.')
      .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer.'),
    body('unit')
      .optional()
      .isIn(['piece', 'box', 'kg', 'liter', 'tablet', 'bottle', 'pack', 'other'])
      .withMessage('Invalid unit.'),
    body('costPrice')
      .notEmpty().withMessage('Cost price is required.')
      .isFloat({ min: 0 }).withMessage('Cost price must be a positive number.'),
    body('minThreshold')
      .optional()
      .isInt({ min: 0 }).withMessage('Minimum threshold must be non-negative.'),
    body('maxThreshold')
      .optional()
      .isInt({ min: 0 }).withMessage('Maximum threshold must be non-negative.'),
    body('expiryDate')
      .optional()
      .isISO8601().withMessage('Expiry date must be a valid date.'),
  ],

  /**
   * Validate inventory item update
   */
  updateInventory: [
    body('itemName')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Item name cannot exceed 100 characters.'),
    body('quantity')
      .optional()
      .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer.'),
    body('costPrice')
      .optional()
      .isFloat({ min: 0 }).withMessage('Cost price must be a positive number.'),
    body('minThreshold')
      .optional()
      .isInt({ min: 0 }).withMessage('Minimum threshold must be non-negative.'),
  ],

  /**
   * Validate quantity update
   */
  updateQuantity: [
    body('quantityChange')
      .notEmpty().withMessage('Quantity change is required.')
      .isInt().withMessage('Quantity change must be an integer.'),
    body('reason')
      .optional()
      .isIn(['restock', 'consumed', 'adjustment'])
      .withMessage('Invalid reason.'),
  ],

  /**
   * Validate inventory ID parameter
   */
  validateInventoryId: [
    param('id')
      .isMongoId().withMessage('Invalid inventory item ID format.'),
  ],

  /**
   * Validate category parameter
   */
  validateCategory: [
    param('category')
      .isIn([
        'medication',
        'medical_supplies',
        'equipment',
        'lab_materials',
        'consumables',
        'office_supplies',
        'other',
      ])
      .withMessage('Invalid category.'),
  ],
};

module.exports = inventoryValidators;
