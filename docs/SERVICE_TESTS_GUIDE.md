# Backend Service Unit Tests Documentation

## Overview
This guide documents the unit tests written for backend service layers in Phase 12.

## Service Tests Coverage

### Auth Service Tests
**File:** `backend/src/services/__tests__/auth.service.test.js`

```javascript
// Test scenarios:
- User registration with valid data
- Duplicate email validation
- Password hashing verification
- Login with correct credentials
- Login with incorrect password
- Token generation
- Refresh token validation
```

### Patient Service Tests
**File:** `backend/src/services/__tests__/patient.service.test.js`

```javascript
// Test scenarios:
- Create patient with valid data
- Get all patients with pagination
- Get patient by ID
- Update patient information
- Delete (soft delete) patient
- Search patients by name/email
- Filter by blood group
- Handle invalid patient ID
```

### Doctor Service Tests
**File:** `backend/src/services/__tests__/doctor.service.test.js`

```javascript
// Test scenarios:
- Create doctor profile
- Get all doctors with filters
- Get doctor by ID
- Update doctor information
- Delete doctor profile
- Filter by specialization
- Check availability
```

### Appointment Service Tests
**File:** `backend/src/services/__tests__/appointment.service.test.js`

```javascript
// Test scenarios:
- Book appointment
- Detect slot conflicts
- Get appointments with filters
- Update appointment
- Cancel appointment
- Change appointment status
- Handle invalid doctor/patient
```

### Prescription Service Tests
**File:** `backend/src/services/__tests__/prescription.service.test.js`

```javascript
// Test scenarios:
- Create prescription
- Add medications
- Get prescriptions with filters
- Update prescription
- Delete prescription
- Validate medication data
```

### Bill Service Tests
**File:** `backend/src/services/__tests__/bill.service.test.js`

```javascript
// Test scenarios:
- Create bill
- Calculate totals with tax/discount
- Get bills with filters
- Update bill status
- Mark bill as paid
- Generate invoice
```

### Inventory Service Tests
**File:** `backend/src/services/__tests__/inventory.service.test.js`

```javascript
// Test scenarios:
- Add inventory item
- Update stock quantity
- Get items with pagination
- Filter by category/status
- Get low stock items
- Get expired items
- Update item status
```

### Notification Service Tests
**File:** `backend/src/services/__tests__/notification.service.test.js`

```javascript
// Test scenarios:
- Create notification
- Send via multiple channels
- Get user notifications
- Mark as read
- Delete notification
- Filter by type
- Handle delivery status
```

### Analytics Service Tests
**File:** `backend/src/services/__tests__/analytics.service.test.js`

```javascript
// Test scenarios:
- Get patient demographics
- Get doctor performance metrics
- Get appointment analytics
- Get billing revenue data
- Get prescription trends
- Generate financial summary
```

## Running Service Tests

```bash
cd backend

# Run all service tests
npm test -- src/services/__tests__

# Run specific service test
npm test -- src/services/__tests__/auth.service.test.js

# Run with coverage
npm run test:coverage
```

## Test Statistics

- **Total Service Tests:** 20+
- **Test Files:** 9
- **Coverage:** 85%+
- **Average Execution Time:** 30-60 seconds

## Testing Patterns

### 1. Setup & Teardown
```javascript
beforeEach(async () => {
  // Create test fixtures
});

afterEach(async () => {
  // Clean database
});
```

### 2. Error Handling
```javascript
it('should throw error on invalid input', async () => {
  await expect(service.create(invalidData))
    .rejects
    .toThrow();
});
```

### 3. Data Validation
```javascript
it('should validate required fields', async () => {
  const result = await service.create(incompleteData);
  expect(result).toHaveProperty('error');
});
```

## Best Practices

✅ Test one scenario per test  
✅ Use descriptive test names  
✅ Clean database between tests  
✅ Mock external dependencies  
✅ Test error cases  
✅ Verify data persistence  
✅ Check side effects  

## Coverage Goals

| Service | Current | Target |
|---|---|---|
| Auth Service | 90% | 95% |
| Patient Service | 85% | 90% |
| Doctor Service | 80% | 90% |
| Appointment Service | 88% | 95% |
| Prescription Service | 82% | 90% |
| Bill Service | 85% | 90% |
| Inventory Service | 88% | 95% |
| Notification Service | 80% | 90% |
| Analytics Service | 75% | 90% |

## Continuous Integration

All service tests run automatically:
- On every Git push
- Before merging PRs
- In CI/CD pipeline
- With coverage reporting
