const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const Patient = require('../../models/Patient');
const connectDB = require('../../config/database');

describe('Patient Routes Integration Tests', () => {
  let connection;
  let accessToken;
  let userId;
  const userData = {
    email: 'admin@hospital.com',
    password: 'Admin@12345',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  };

  const patientData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '9876543210',
    dateOfBirth: '1990-01-15',
    gender: 'male',
    bloodGroup: 'O+',
    address: '123 Main St',
  };

  beforeAll(async () => {
    connection = await connectDB();
    // Register admin user
    const res = await request(app).post('/api/auth/register').send(userData);
    accessToken = res.body.data.accessToken;
    userId = res.body.data.user._id;
  });

  afterEach(async () => {
    await Patient.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await connection.close();
  });

  describe('POST /api/patients', () => {
    it('should create a new patient', async () => {
      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patientData)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.firstName).toBe(patientData.firstName);
      expect(res.body.data.email).toBe(patientData.email);
    });

    it('should return 400 for missing required fields', async () => {
      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ firstName: 'John' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should return 401 for unauthenticated request', async () => {
      const res = await request(app)
        .post('/api/patients')
        .send(patientData)
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/patients', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patientData);
      
      await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...patientData, firstName: 'Jane', email: 'jane@example.com' });
    });

    it('should get all patients with pagination', async () => {
      const res = await request(app)
        .get('/api/patients?page=1&limit=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('patients');
      expect(res.body.data).toHaveProperty('pagination');
      expect(res.body.data.patients.length).toBe(2);
    });

    it('should search patients by name', async () => {
      const res = await request(app)
        .get('/api/patients?search=John')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.patients.length).toBe(1);
      expect(res.body.data.patients[0].firstName).toBe('John');
    });

    it('should filter patients by blood group', async () => {
      const res = await request(app)
        .get('/api/patients?bloodGroup=O%2B')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.patients.every(p => p.bloodGroup === 'O+')).toBe(true);
    });

    it('should return 401 for unauthenticated request', async () => {
      const res = await request(app).get('/api/patients').expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/patients/:id', () => {
    let patientId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patientData);
      patientId = res.body.data._id;
    });

    it('should get patient by ID', async () => {
      const res = await request(app)
        .get(`/api/patients/${patientId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(patientId);
    });

    it('should return 404 for non-existent patient', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .get(`/api/patients/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/patients/:id', () => {
    let patientId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patientData);
      patientId = res.body.data._id;
    });

    it('should update patient', async () => {
      const updateData = { firstName: 'Jonathan' };
      const res = await request(app)
        .put(`/api/patients/${patientId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.firstName).toBe('Jonathan');
    });

    it('should return 404 for non-existent patient', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/api/patients/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ firstName: 'Test' })
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/patients/:id', () => {
    let patientId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patientData);
      patientId = res.body.data._id;
    });

    it('should soft delete patient', async () => {
      const res = await request(app)
        .delete(`/api/patients/${patientId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      const deletedPatient = await Patient.findById(patientId);
      expect(deletedPatient.isDeleted).toBe(true);
    });

    it('should return 404 for non-existent patient', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .delete(`/api/patients/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });
});
