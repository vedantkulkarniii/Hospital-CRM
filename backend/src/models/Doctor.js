'use strict';

const mongoose = require('mongoose');

// ─── Availability slot sub-schema ────────────────────────────────────────────
const availabilitySlotSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: String,
      enum: {
        values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        message: 'Invalid day of week',
      },
      required: true,
    },
    startTime: {
      type: String,
      required: true, // Format: HH:MM (e.g., "09:00")
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'],
    },
    endTime: {
      type: String,
      required: true, // Format: HH:MM (e.g., "17:00")
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

// ─── Qualification sub-schema ───────────────────────────────────────────────
const qualificationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: true,
      trim: true,
      // e.g., "MBBS", "MD", "MS", "PhD"
    },
    institution: {
      type: String,
      trim: true,
      default: '',
    },
    yearObtained: {
      type: Number,
      required: true,
    },
    certificateNumber: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false },
);

// ─── Main Doctor schema ───────────────────────────────────────────────────────
const doctorSchema = new mongoose.Schema(
  {
    // Link to User account (required for doctors)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },

    // Professional info
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
      enum: {
        values: [
          'General Practice',
          'Cardiology',
          'Dermatology',
          'Neurology',
          'Orthopedics',
          'Pediatrics',
          'Psychiatry',
          'Surgery',
          'Ophthalmology',
          'ENT',
          'Gastroenterology',
          'Pulmonology',
          'Oncology',
          'Nephrology',
          'Rheumatology',
          'Urology',
          'Other',
        ],
        message: 'Invalid specialization',
      },
    },

    qualifications: {
      type: [qualificationSchema],
      required: true,
      validate: {
        validator: (v) => v && v.length > 0,
        message: 'At least one qualification is required',
      },
    },

    yearsOfExperience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Years of experience cannot be negative'],
      max: [80, 'Years of experience cannot exceed 80'],
    },

    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
    },

    // Availability
    availability: {
      type: [availabilitySlotSchema],
      default: [],
    },

    // Pricing
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: [0, 'Consultation fee cannot be negative'],
    },

    // Doctor ID — auto-generated unique identifier (e.g. DOC-0001)
    doctorId: {
      type: String,
      unique: true,
    },

    // Bio and additional info
    bio: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },

    // Contact
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, 'Please enter a valid phone number'],
    },

    // Clinic/Department info
    department: {
      type: String,
      trim: true,
      default: '',
    },

    officeAddress: {
      type: String,
      trim: true,
      default: '',
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
      // Set to true after admin verifies credentials
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

    // Audit
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ isActive: 1 });
doctorSchema.index({ isVerified: 1 });
doctorSchema.index({ isDeleted: 1 });
doctorSchema.index({ createdAt: -1 });

// ─── Virtuals ─────────────────────────────────────────────────────────────────
doctorSchema.virtual('totalExperience').get(function () {
  return this.yearsOfExperience;
});

// ─── Pre-save: generate doctorId ──────────────────────────────────────────────
doctorSchema.pre('save', async function (next) {
  if (this.doctorId) {
    return next();
  }
  try {
    const count = await mongoose.model('Doctor').countDocuments();
    this.doctorId = `DOC-${String(count + 1).padStart(4, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

// ─── Query helpers — always exclude soft-deleted records by default ───────────
doctorSchema.pre(/^find/, function (next) {
  // Only apply the filter if not explicitly overridden
  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
