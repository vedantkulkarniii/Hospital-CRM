'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const logger = require('../utils/logger');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hospital_crm';

// Test data
const testUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@hospital.com',
    password: 'Admin@123',
    role: 'admin',
    phone: '+91-9876543210',
  },
  {
    firstName: 'Dr. Rajesh',
    lastName: 'Kumar',
    email: 'doctor@hospital.com',
    password: 'Doctor@123',
    role: 'doctor',
    phone: '+91-9876543211',
  },
  {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'receptionist@hospital.com',
    password: 'Receptionist@123',
    role: 'receptionist',
    phone: '+91-9876543212',
  },
  {
    firstName: 'John',
    lastName: 'Patient',
    email: 'patient@hospital.com',
    password: 'Patient@123',
    role: 'patient',
    phone: '+91-9876543213',
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    logger.info('Connected to MongoDB');

    // Clear existing test data
    await User.deleteMany({ email: { $in: testUsers.map((u) => u.email) } });
    await Doctor.deleteMany({});
    logger.info('Cleared existing test data');

    // Create users
    const createdUsers = [];
    for (const userData of testUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      logger.info(`✅ Created ${user.role} user: ${user.email}`);
    }

    // Create doctor profile for doctor user
    const doctorUser = createdUsers.find((u) => u.role === 'doctor');
    if (doctorUser) {
      const doctor = await Doctor.create({
        userId: doctorUser._id,
        specialization: 'Cardiology',
        qualifications: [
          {
            degree: 'MBBS',
            institution: 'Delhi Medical College',
            yearObtained: 2015,
            certificateNumber: 'MBBS-2015-12345',
          },
          {
            degree: 'MD Cardiology',
            institution: 'AIIMS Delhi',
            yearObtained: 2018,
            certificateNumber: 'MD-2018-67890',
          },
        ],
        yearsOfExperience: 8,
        licenseNumber: 'LIC-INDIA-2015-98765',
        phone: doctorUser.phone,
        consultationFee: 500,
        department: 'Cardiology Department',
        officeAddress: '123 Medical Plaza, Delhi - 110001',
        bio: 'Experienced cardiologist with 8+ years of practice',
        availability: [
          { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { dayOfWeek: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
          { dayOfWeek: 'Saturday', startTime: '10:00', endTime: '14:00', isAvailable: true },
        ],
        createdBy: createdUsers[0]._id, // Admin user
        isVerified: true,
        isActive: true,
      });
      logger.info(`✅ Created doctor profile: ${doctor.doctorId}`);
    }

    // Create patient profile for patient user
    const patientUser = createdUsers.find((u) => u.role === 'patient');
    if (patientUser) {
      const patient = await Patient.create({
        firstName: patientUser.firstName,
        lastName: patientUser.lastName,
        dateOfBirth: new Date('1990-05-15'),
        gender: 'male',
        phone: patientUser.phone,
        email: patientUser.email,
        bloodGroup: 'O+',
        address: {
          street: '456 Main Street',
          city: 'Delhi',
          state: 'Delhi',
          postalCode: '110001',
          country: 'India',
        },
        emergencyContact: {
          name: 'Jane Patient',
          relationship: 'Spouse',
          phone: '+91-9876543214',
        },
        userId: patientUser._id,
        createdBy: createdUsers[0]._id, // Admin user
        isActive: true,
      });
      logger.info(`✅ Created patient profile: ${patient.patientId}`);
    }

    logger.info('\n✨ Test data seeding completed successfully!\n');
    logger.info('📧 Test Accounts:');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testUsers.forEach((user) => {
      logger.info(`${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
    });
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`, { stack: error.stack });
    process.exit(1);
  }
};

seedDatabase();
