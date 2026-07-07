'use strict';

const mongoose = require('mongoose');

// ─── Medication sub-schema ───────────────────────────────────────────────────
const medicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Medication name is required'],
      trim: true,
    },
    dosage: {
      type: String,
      required: [true, 'Dosage is required'],
      trim: true,
      // e.g., "500mg", "5ml", "2 tablets"
    },
    frequency: {
      type: String,
      required: [true, 'Frequency is required'],
      trim: true,
      // e.g., "Once daily", "Twice daily", "Every 8 hours"
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
      // e.g., "7 days", "2 weeks", "1 month"
    },
    instructions: {
      type: String,
      trim: true,
      default: '',
      // e.g., "Take with food", "Avoid dairy products"
    },
  },
  { _id: false },
);

// ─── Main Prescription schema ──────────────────────────────────────────────────
const prescriptionSchema = new mongoose.Schema(
  {
    // References
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: [true, 'Appointment ID is required'],
    },

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

    // Medications
    medications: {
      type: [medicationSchema],
      required: true,
      validate: {
        validator: (v) => v && v.length > 0,
        message: 'At least one medication is required',
      },
    },

    // Diagnosis
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
      trim: true,
      maxlength: [500, 'Diagnosis cannot exceed 500 characters'],
    },

    // Clinical notes
    clinicalNotes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Clinical notes cannot exceed 1000 characters'],
    },

    // Additional instructions
    instructions: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Instructions cannot exceed 500 characters'],
    },

    // Follow-up
    followUpDate: {
      type: Date,
      default: null,
    },

    followUpNotes: {
      type: String,
      trim: true,
      default: '',
    },

    // Prescription ID — auto-generated unique identifier (e.g. RX-0001)
    prescriptionId: {
      type: String,
      unique: true,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
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
prescriptionSchema.index({ appointment: 1 });
prescriptionSchema.index({ patient: 1 });
prescriptionSchema.index({ doctor: 1 });
prescriptionSchema.index({ prescriptionId: 1 }, { unique: true, sparse: true });
prescriptionSchema.index({ createdAt: -1 });
prescriptionSchema.index({ isDeleted: 1 });

// ─── Pre-save: generate prescriptionId ────────────────────────────────────────
prescriptionSchema.pre('save', async function (next) {
  if (this.prescriptionId) {
    return next();
  }
  try {
    const count = await mongoose.model('Prescription').countDocuments();
    this.prescriptionId = `RX-${String(count + 1).padStart(5, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

// ─── Query helpers — always exclude soft-deleted records by default ───────────
prescriptionSchema.pre(/^find/, function (next) {
  // Only apply the filter if not explicitly overridden
  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
  next();
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;
