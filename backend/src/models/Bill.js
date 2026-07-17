'use strict';

const mongoose = require('mongoose');

// ─── Bill Schema ──────────────────────────────────────────────────────────────
const billSchema = new mongoose.Schema(
  {
    // References
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: [true, 'Appointment ID is required'],
    },

    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
      default: null,
    },

    // Bill details
    billId: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // Amounts
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: [0, 'Consultation fee cannot be negative'],
    },

    medicationCost: {
      type: Number,
      default: 0,
      min: [0, 'Medication cost cannot be negative'],
    },

    labTestCost: {
      type: Number,
      default: 0,
      min: [0, 'Lab test cost cannot be negative'],
    },

    otherCharges: {
      type: Number,
      default: 0,
      min: [0, 'Other charges cannot be negative'],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },

    taxPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Tax percentage cannot be negative'],
      max: [100, 'Tax percentage cannot exceed 100'],
    },

    // Calculated fields (stored for history)
    subtotal: {
      type: Number,
      default: 0,
    },

    taxAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },

    // Payment status
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'overdue', 'cancelled'],
      default: 'pending',
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: [0, 'Paid amount cannot be negative'],
    },

    pendingAmount: {
      type: Number,
      default: function () {
        return this.totalAmount - this.paidAmount;
      },
    },

    // Payment details
    paymentDate: {
      type: Date,
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'pending'],
      default: 'pending',
    },

    transactionId: {
      type: String,
      trim: true,
      default: '',
    },

    // Due date
    issuedDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },

    // Notes
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },

    // Audit
    createdBy: {
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

// ─── Virtuals ─────────────────────────────────────────────────────────────────
billSchema.virtual('isOverdue').get(function () {
  if (this.status === 'paid' || this.status === 'cancelled') {
    return false;
  }
  return new Date() > this.dueDate;
});

billSchema.virtual('daysOverdue').get(function () {
  if (!this.isOverdue) {
    return 0;
  }
  const now = new Date();
  const diff = now - this.dueDate;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
billSchema.index({ patient: 1 });
billSchema.index({ appointment: 1 });
billSchema.index({ status: 1 });
billSchema.index({ dueDate: 1 });
billSchema.index({ createdAt: -1 });
billSchema.index({ isDeleted: 1 });

// ─── Pre-save: generate billId ─────────────────────────────────────────────────
billSchema.pre('save', async function (next) {
  if (this.billId) {
    return next();
  }
  try {
    const count = await mongoose.model('Bill').countDocuments();
    this.billId = `INV-${String(count + 1).padStart(6, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

// ─── Pre-save: calculate amounts ───────────────────────────────────────────────
billSchema.pre('save', function (next) {
  this.subtotal = this.consultationFee + this.medicationCost + this.labTestCost + this.otherCharges;
  this.subtotal = Math.max(0, this.subtotal - this.discount);
  this.taxAmount = (this.subtotal * this.taxPercentage) / 100;
  this.totalAmount = this.subtotal + this.taxAmount;
  this.pendingAmount = Math.max(0, this.totalAmount - this.paidAmount);

  // Auto-update status based on payment
  if (this.paidAmount >= this.totalAmount) {
    this.status = 'paid';
  } else if (this.paidAmount > 0 && this.paidAmount < this.totalAmount) {
    this.status = 'partial';
  } else if (this.paidAmount === 0 && new Date() > this.dueDate) {
    this.status = 'overdue';
  }

  next();
});

// ─── Query helpers — always exclude soft-deleted records by default ───────────
billSchema.pre(/^find/, function (next) {
  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
  next();
});

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;
