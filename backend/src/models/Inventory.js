'use strict';

const mongoose = require('mongoose');

// ─── Inventory Item Schema ────────────────────────────────────────────────────
const inventorySchema = new mongoose.Schema(
  {
    // Basic Info
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [100, 'Item name cannot exceed 100 characters'],
    },

    itemCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    category: {
      type: String,
      enum: [
        'medication',
        'medical_supplies',
        'equipment',
        'lab_materials',
        'consumables',
        'office_supplies',
        'other',
      ],
      default: 'other',
    },

    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // Stock Management
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },

    unit: {
      type: String,
      enum: ['piece', 'box', 'kg', 'liter', 'tablet', 'bottle', 'pack', 'other'],
      default: 'piece',
    },

    minThreshold: {
      type: Number,
      min: [0, 'Minimum threshold cannot be negative'],
      default: 10,
    },

    maxThreshold: {
      type: Number,
      min: [0, 'Maximum threshold cannot be negative'],
      default: 100,
    },

    // Pricing
    costPrice: {
      type: Number,
      required: [true, 'Cost price is required'],
      min: [0, 'Cost price cannot be negative'],
    },

    sellingPrice: {
      type: Number,
      default: 0,
      min: [0, 'Selling price cannot be negative'],
    },

    // Supplier Info
    supplier: {
      type: String,
      trim: true,
      default: '',
    },

    supplierContact: {
      type: String,
      trim: true,
      default: '',
    },

    // Dates
    dateAdded: {
      type: Date,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
      default: null,
    },

    lastRestockDate: {
      type: Date,
      default: null,
    },

    lastRestockQuantity: {
      type: Number,
      default: 0,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock', 'discontinued'],
      default: 'in_stock',
    },

    // Tracking
    totalConsumed: {
      type: Number,
      default: 0,
    },

    lastConsumedDate: {
      type: Date,
      default: null,
    },

    // Audit
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },

    deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ─── Virtuals ────────────────────────────────────────────────────────────────
inventorySchema.virtual('totalValue').get(function () {
  return this.quantity * this.costPrice;
});

inventorySchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.minThreshold;
});

inventorySchema.virtual('isOutOfStock').get(function () {
  return this.quantity === 0;
});

inventorySchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) {return false;}
  return new Date() > this.expiryDate;
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
inventorySchema.index({ category: 1 });
inventorySchema.index({ status: 1 });
inventorySchema.index({ quantity: 1 });
inventorySchema.index({ expiryDate: 1 });
inventorySchema.index({ createdAt: -1 });
inventorySchema.index({ isActive: 1 });
inventorySchema.index({ isDeleted: 1 });

// ─── Pre-save: generate itemCode if not provided ──────────────────────────────
inventorySchema.pre('save', async function (next) {
  if (this.itemCode) {
    return next();
  }
  try {
    const count = await mongoose.model('Inventory').countDocuments();
    this.itemCode = `INV-${String(count + 1).padStart(6, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

// ─── Pre-save: update status based on quantity ────────────────────────────────
inventorySchema.pre('save', function (next) {
  if (this.quantity === 0) {
    this.status = 'out_of_stock';
  } else if (this.quantity <= this.minThreshold) {
    this.status = 'low_stock';
  } else {
    this.status = 'in_stock';
  }
  next();
});

// ─── Query helpers — always exclude soft-deleted records by default ───────────
inventorySchema.pre(/^find/, function (next) {
  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
  next();
});

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;
