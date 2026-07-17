'use strict';

const mongoose = require('mongoose');

// ─── Appointment schema ───────────────────────────────────────────────────────
const appointmentSchema = new mongoose.Schema(
  {
    // References
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor ID is required'],
    },

    // Appointment details
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },

    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    },

    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    },

    // Appointment type (consultation, follow-up, checkup, etc.)
    type: {
      type: String,
      enum: {
        values: ['consultation', 'follow-up', 'checkup', 'treatment', 'procedure', 'other'],
        message: 'Invalid appointment type',
      },
      default: 'consultation',
    },

    // Appointment status
    status: {
      type: String,
      enum: {
        values: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
        message: 'Invalid appointment status',
      },
      default: 'scheduled',
    },

    // Reason for appointment
    reason: {
      type: String,
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
      default: '',
    },

    // Notes from doctor/receptionist
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },

    // Consultation fee (at time of booking)
    consultationFee: {
      type: Number,
      default: 0,
      min: [0, 'Consultation fee cannot be negative'],
    },

    // Appointment ID — auto-generated unique identifier (e.g. APT-0001)
    appointmentId: {
      type: String,
      unique: true,
    },

    // Cancellation details
    cancelledBy: {
      type: String,
      enum: {
        values: ['patient', 'doctor', 'receptionist', 'system'],
        message: 'Invalid cancellation source',
      },
      default: null,
    },

    cancellationReason: {
      type: String,
      trim: true,
      default: '',
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    // Completion/Follow-up
    completedAt: {
      type: Date,
      default: null,
    },

    nextFollowUpDate: {
      type: Date,
      default: null,
    },

    // Reminders
    reminderSent: {
      type: Boolean,
      default: false,
    },

    reminderSentAt: {
      type: Date,
      default: null,
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

// ─── Indexes ──────────────────────────────────────────────────────────────────
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ doctor: 1 });
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ createdAt: -1 });
appointmentSchema.index({ appointmentDate: 1, doctor: 1 }, { name: 'doctor_date_index' });
appointmentSchema.index({ appointmentDate: 1, patient: 1 }, { name: 'patient_date_index' });
appointmentSchema.index({ isDeleted: 1 });

// ─── Virtual: appointment duration in minutes ────────────────────────────────
appointmentSchema.virtual('durationMinutes').get(function () {
  if (!this.startTime || !this.endTime) return null;
  const [startHour, startMin] = this.startTime.split(':').map(Number);
  const [endHour, endMin] = this.endTime.split(':').map(Number);
  const startTotalMin = startHour * 60 + startMin;
  const endTotalMin = endHour * 60 + endMin;
  return endTotalMin - startTotalMin;
});

// ─── Virtual: is appointment in past ──────────────────────────────────────────
appointmentSchema.virtual('isPast').get(function () {
  if (!this.appointmentDate) return null;
  const appointmentDateTime = new Date(this.appointmentDate);
  return appointmentDateTime < new Date();
});

// ─── Virtual: is appointment today ────────────────────────────────────────────
appointmentSchema.virtual('isToday').get(function () {
  if (!this.appointmentDate) return null;
  const today = new Date();
  const apptDate = new Date(this.appointmentDate);
  return (
    today.getFullYear() === apptDate.getFullYear() &&
    today.getMonth() === apptDate.getMonth() &&
    today.getDate() === apptDate.getDate()
  );
});

// ─── Pre-save: generate appointmentId ──────────────────────────────────────────
appointmentSchema.pre('save', async function (next) {
  if (this.appointmentId) {
    return next();
  }
  try {
    const count = await mongoose.model('Appointment').countDocuments();
    this.appointmentId = `APT-${String(count + 1).padStart(5, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

// ─── Query helpers — always exclude soft-deleted records by default ───────────
appointmentSchema.pre(/^find/, function (next) {
  // Only apply the filter if not explicitly overridden
  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
