'use strict';

const mongoose = require('mongoose');

// ─── Address sub-schema ──────────────────────────────────────────────────────
const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    postalCode: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: 'India' },
  },
  { _id: false },
);

// ─── Emergency contact sub-schema ────────────────────────────────────────────
const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    relationship: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
  },
  { _id: false },
);

// ─── Medical history entry sub-schema ────────────────────────────────────────
const medicalHistorySchema = new mongoose.Schema(
  {
    condition: { type: String, required: true, trim: true },
    diagnosedAt: { type: Date, default: null },
    notes: { type: String, trim: true, default: '' },
    isOngoing: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// ─── Main Patient schema ──────────────────────────────────────────────────────
const patientSchema = new mongoose.Schema(
  {
    // Personal info
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other', 'prefer_not_to_say'],
        message: 'Gender must be male, female, other, or prefer_not_to_say',
      },
      required: [true, 'Gender is required'],
    },

    // Contact
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, 'Please enter a valid phone number'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
      default: null,
    },

    // Address
    address: { type: addressSchema, default: () => ({}) },

    // Medical info
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
        message: 'Invalid blood group',
      },
      default: 'unknown',
    },
    allergies: {
      type: [String],
      default: [],
    },
    medicalHistory: {
      type: [medicalHistorySchema],
      default: [],
    },
    emergencyContact: { type: emergencyContactSchema, default: () => ({}) },

    // Optional link to a User account (if patient has portal access)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Patient ID — auto-generated unique identifier (e.g. PAT-0001)
    patientId: {
      type: String,
      unique: true,
    },

    // Audit
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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
patientSchema.index({ firstName: 1, lastName: 1 });
patientSchema.index({ email: 1 });
patientSchema.index({ phone: 1 });
patientSchema.index({ patientId: 1 }, { unique: true, sparse: true });
patientSchema.index({ isDeleted: 1 });
patientSchema.index({ createdAt: -1 });
patientSchema.index(
  { firstName: 'text', lastName: 'text', email: 'text', phone: 'text' },
  { name: 'patient_text_search' },
);

// ─── Virtuals ─────────────────────────────────────────────────────────────────
patientSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

patientSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) {
    return null;
  }
  const today = new Date();
  const dob = new Date(this.dateOfBirth);
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
});

// ─── Pre-save: generate patientId ─────────────────────────────────────────────
patientSchema.pre('save', async function (next) {
  if (this.patientId) {
    return next();
  }
  try {
    const count = await mongoose.model('Patient').countDocuments();
    this.patientId = `PAT-${String(count + 1).padStart(4, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

// ─── Query helpers — always exclude soft-deleted records by default ───────────
patientSchema.pre(/^find/, function (next) {
  // Only apply the filter if not explicitly overridden
  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
  next();
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
