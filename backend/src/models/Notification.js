'use strict';

const mongoose = require('mongoose');

// ─── Notification Schema ──────────────────────────────────────────────────────
const notificationSchema = new mongoose.Schema(
  {
    // Recipient
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient user ID is required'],
    },

    // Notification type
    type: {
      type: String,
      enum: [
        'appointment_booked',
        'appointment_confirmed',
        'appointment_cancelled',
        'appointment_reminder',
        'appointment_completed',
        'prescription_issued',
        'bill_generated',
        'bill_paid',
        'payment_reminder',
        'document_available',
        'system_alert',
        'general_message',
      ],
      required: [true, 'Notification type is required'],
    },

    // Title & Message
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },

    // Related entity references
    relatedEntity: {
      entityType: {
        type: String,
        enum: ['appointment', 'prescription', 'bill', 'patient', 'doctor', 'none'],
        default: 'none',
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
    },

    // Additional data (flexible)
    metadata: {
      type: Object,
      default: {},
    },

    // Status
    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },

    // Channels
    channels: {
      inApp: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: false,
      },
      sms: {
        type: Boolean,
        default: false,
      },
      push: {
        type: Boolean,
        default: false,
      },
    },

    // Delivery status
    deliveryStatus: {
      inApp: {
        status: { type: String, enum: ['pending', 'delivered', 'failed'], default: 'pending' },
        deliveredAt: { type: Date, default: null },
        failureReason: { type: String, default: '' },
      },
      email: {
        status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
        sentAt: { type: Date, default: null },
        failureReason: { type: String, default: '' },
      },
      sms: {
        status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
        sentAt: { type: Date, default: null },
        failureReason: { type: String, default: '' },
      },
      push: {
        status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
        sentAt: { type: Date, default: null },
        failureReason: { type: String, default: '' },
      },
    },

    // Priority
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },

    // Expiry
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },

    // Audit
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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

// ─── Indexes ──────────────────────────────────────────────────────────────────
notificationSchema.index({ recipient: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ isDeleted: 1 });

// ─── TTL Index — auto-delete expired notifications after 30 days ────────────
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ─── Query helpers — always exclude soft-deleted records by default ───────────
notificationSchema.pre(/^find/, function (next) {
  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
  next();
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
