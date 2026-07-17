# Backend Testing Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: MongoDB Connection Timeout

**Error:**
```
MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Ensure MongoDB is running
# For local MongoDB:
mongod

# For Docker:
docker run -d -p 27017:27017 mongo
```

---

### Issue 2: Environment Variables Not Loaded

**Error:**
```
Error: secretOrPrivateKey must have a value
```

**Solution:**
1. Create `.env` file in backend directory:
```bash
cp .env.example .env
```

2. Ensure `.env` has JWT secrets:
```env
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
```

3. Restart the server

---

### Issue 3: Tests Hanging/Not Terminating

**Error:**
```
Jest did not exit one second after the test run has completed
```

**Solution:**
```bash
# In jest.config.js, ensure proper timeout:
module.exports = {
  testTimeout: 30000, // 30 seconds
  detectOpenHandles: true,
};

# Or run with timeout:
npm test -- --testTimeout=30000
```

---

### Issue 4: Database Not Cleaned Between Tests

**Error:**
```
Duplicate key error collection
```

**Solution:**
Ensure proper cleanup in afterEach hook:
```javascript
afterEach(async () => {
  await User.deleteMany({});
  await Patient.deleteMany({});
  await Doctor.deleteMany({});
});
```

---

### Issue 5: Schema Validation Errors

**Error:**
```
Invalid value for schema path `metadata.type`, got value "undefined"
```

**Solution:**
Check model schema field types:
```javascript
// ❌ Wrong
metadata: {
  type: mongoose.Schema.Mixed,
}

// ✅ Correct
metadata: {
  type: Object,
}
```

---

### Issue 6: Rate Limiting Blocks Tests

**Error:**
```
Too many auth attempts. Please try again in 15 minutes
```

**Solution:**
In `src/routes/auth.routes.js`, disable for development:
```javascript
// Development mode: disable rate limiter
const authLimiter = (req, res, next) => next();

// Or use environment variable
const authLimiter = process.env.NODE_ENV === 'test' 
  ? (req, res, next) => next()
  : actualRateLimiter;
```

---

### Issue 7: Duplicate Index Errors

**Error:**
```
Duplicate schema index on {"email":1} found
```

**Solution:**
Check model for duplicate index definitions:
```javascript
// ❌ Avoid duplicates
userSchema.index({ email: 1 });
userSchema.index({ email: 1 }); // Duplicate!

// ✅ Correct
userSchema.index({ email: 1 });
userSchema.index({ email: 1, isDeleted: 1 }); // Composite index is OK
```

---

### Issue 8: Invalid Test Data

**Error:**
```
ValidationError: Patient validation failed: email: Email not valid
```

**Solution:**
Use valid test fixtures:
```javascript
const patientData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com', // Valid email
  phone: '9876543210',
  dateOfBirth: '1990-01-15',
  gender: 'male',
  bloodGroup: 'O+',
  address: '123 Main St'
};
```

---

### Issue 9: Port Already in Use

**Error:**
```
listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find process on port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=5001 npm test
```

---

### Issue 10: Supertest Request Failures

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5000
```

**Solution:**
Ensure server is properly exported and running:
```javascript
const request = require('supertest');
const app = require('../../app'); // Correct import

// Don't use server.listen() in tests
// Use just the app
request(app)
  .post('/api/auth/login')
  .send(testData)
  .expect(200);
```

---

## Performance Optimization

### 1. Reduce Test Timeout for Faster Feedback
```bash
npm test -- --testTimeout=10000
```

### 2. Run Tests in Parallel
```bash
npm test -- --maxWorkers=4
```

### 3. Skip Slow Tests During Development
```javascript
it.skip('slow integration test', () => {
  // Skip this test
});
```

### 4. Use Test Database in Memory (Optional)
Use MongoDB memory server for faster tests:
```bash
npm install -D mongodb-memory-server
```

---

## Debugging Strategies

### 1. Print Debug Information
```javascript
console.log('Request data:', JSON.stringify(testData, null, 2));
console.log('Response:', res.body);
```

### 2. Run Single Test File
```bash
npm test -- src/routes/__tests__/auth.routes.test.js
```

### 3. Run Specific Test Suite
```bash
npm test -- -t "Auth Routes"
```

### 4. Verbose Output
```bash
npm test -- --verbose
```

---

## Common Patterns

### Testing with Authentication
```javascript
let accessToken;

beforeEach(async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send(userData);
  accessToken = res.body.data.accessToken;
});

it('should access protected route', async () => {
  await request(app)
    .get('/api/patients')
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);
});
```

### Testing Error Responses
```javascript
it('should return 401 for invalid credentials', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'wrong' })
    .expect(401);
    
  expect(res.body.success).toBe(false);
  expect(res.body.message).toBeDefined();
});
```

### Testing Data Persistence
```javascript
it('should save data to database', async () => {
  const res = await request(app)
    .post('/api/patients')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(patientData)
    .expect(201);
    
  const savedPatient = await Patient.findById(res.body.data._id);
  expect(savedPatient).toBeDefined();
  expect(savedPatient.email).toBe(patientData.email);
});
```

---

## Resource Cleanup

### Clean Up Before Tests
```javascript
beforeAll(async () => {
  await connectDB();
  // Clear all collections
  await Promise.all([
    User.deleteMany({}),
    Patient.deleteMany({}),
    Doctor.deleteMany({}),
  ]);
});
```

### Disconnect After Tests
```javascript
afterAll(async () => {
  await connection.close();
});
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Backend Tests
  run: |
    cd backend
    npm install
    npm test -- --runInBand --coverage
```

### Exit Code Handling
```bash
# Test script should exit with proper code
npm test -- --bail  # Exit on first failure
```

---

## Additional Resources

- [Jest Documentation](https://jestjs.io)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Testing](https://docs.mongodb.com/manual/developers-guide-testing/)
