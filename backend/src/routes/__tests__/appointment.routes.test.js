const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const Patient = require('../../models/Patient');
const Doctor = require('../../models/Doctor');
const Appointment = require('../../models/Appointment');
const { connectDB } = require('../../config/database');

describe('Appointment Routes Integration Tests', () => {
  let connection;
  let accessToken;
  let adminToken;
  let patientId;
  let doctorId;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  beforeAll(async () => {
    connection = await connectDB();

    // Register admin
    const adminRes = await request(app).post('/api/auth/register').send({
      email: 'admin@hospital.com',
      password: 'Admin@12345',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    });
    adminToken = adminRes.body.data.accessToken;

    // Register doctor
    const doctorUserRes = await request(app).post('/api/auth/register').send({
      email: 'doctor@hospital.com',
      password: 'Doctor@12345',
      firstName: 'Dr',
      lastName: 'Smith',
      role: 'doctor',
    });
    accessToken = doctorUserRes.body.data.accessToken;
    const doctorUserId = doctorUserRes.body.data.user._id;

    // Create doctor profile
    const doctorRes = await request(app)
      .post('/api/doctors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: doctorUserId,
        specialization: 'Cardiology',
        qualification: 'MD',
        experience: 10,
        availability: {
          monday: { startTime: '09:00', endTime: '17:00' },
          tuesday: { startTime: '09:00', endTime: '17:00' },
        },
        consultationFee: 500,
      });
    doctorId = doctorRes.body.data._id;

    // Create patient
    const patientRes = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '9876543210',
        dateOfBirth: '1990-01-15',
        gender: 'male',
        bloodGroup: 'O+',
        address: '123 Main St',
      });
    patientId = patientRes.body.data._id;
  });

  afterEach(async () => {
    await Appointment.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await connection.close();
  });

  describe('POST /api/appointments', () => {
    it('should book an appointment', async () => {
      const appointmentData = {
        patientId,
        doctorId,
        appointmentDate: tomorrow.toISOString(),
        appointmentTime: '10:00',
        appointmentType: 'consultation',
        reason: 'Regular checkup',
      };

      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(appointmentData)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('scheduled');
    });

    it('should return 400 for invalid appointment data', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ patientId })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should detect slot conflict', async () => {
      const appointmentData = {
        patientId,
        doctorId,
        appointmentDate: tomorrow.toISOString(),
        appointmentTime: '10:00',
        appointmentType: 'consultation',
        reason: 'Regular checkup',
      };

      // Book first appointment
      await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(appointmentData);

      // Try to book conflicting appointment
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(appointmentData)
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('should return 401 for unauthenticated request', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send({ patientId, doctorId })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/appointments', () => {
    beforeEach(async () => {
      const appointmentData = {
        patientId,
        doctorId,
        appointmentDate: tomorrow.toISOString(),
        appointmentTime: '10:00',
        appointmentType: 'consultation',
        reason: 'Regular checkup',
      };

      await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(appointmentData);
    });

    it('should get all appointments with pagination', async () => {
      const res = await request(app)
        .get('/api/appointments?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('appointments');
      expect(res.body.data).toHaveProperty('pagination');
      expect(res.body.data.appointments.length).toBeGreaterThan(0);
    });

    it('should filter appointments by status', async () => {
      const res = await request(app)
        .get('/api/appointments?status=scheduled')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.appointments.every(a => a.status === 'scheduled')).toBe(true);
    });

    it('should filter appointments by doctor', async () => {
      const res = await request(app)
        .get(`/api/appointments?doctorId=${doctorId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.appointments.every(a => a.doctor._id === doctorId || a.doctor === doctorId)).toBe(true);
    });
  });

  describe('GET /api/appointments/:id', () => {
    let appointmentId;

    beforeEach(async () => {
      const appointmentData = {
        patientId,
        doctorId,
        appointmentDate: tomorrow.toISOString(),
        appointmentTime: '10:00',
        appointmentType: 'consultation',
        reason: 'Regular checkup',
      };

      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(appointmentData);
      appointmentId = res.body.data._id;
    });

    it('should get appointment by ID', async () => {
      const res = await request(app)
        .get(`/api/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(appointmentId);
    });

    it('should return 404 for non-existent appointment', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .get(`/api/appointments/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/appointments/:id', () => {
    let appointmentId;

    beforeEach(async () => {
      const appointmentData = {
        patientId,
        doctorId,
        appointmentDate: tomorrow.toISOString(),
        appointmentTime: '10:00',
        appointmentType: 'consultation',
        reason: 'Regular checkup',
      };

      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(appointmentData);
      appointmentId = res.body.data._id;
    });

    it('should update appointment', async () => {
      const updateData = {
        appointmentTime: '14:00',
        reason: 'Updated reason',
      };

      const res = await request(app)
        .put(`/api/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.appointmentTime).toBe('14:00');
    });
  });

  describe('DELETE /api/appointments/:id', () => {
    let appointmentId;

    beforeEach(async () => {
      const appointmentData = {
        patientId,
        doctorId,
        appointmentDate: tomorrow.toISOString(),
        appointmentTime: '10:00',
        appointmentType: 'consultation',
        reason: 'Regular checkup',
      };

      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(appointmentData);
      appointmentId = res.body.data._id;
    });

    it('should cancel appointment', async () => {
      const res = await request(app)
        .delete(`/api/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('cancelled');
    });
  });
});
