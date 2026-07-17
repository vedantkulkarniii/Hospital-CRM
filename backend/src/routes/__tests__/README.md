# API Routes Integration Tests

This directory contains comprehensive integration tests for all HTTP API routes.

## Test Files

### auth.routes.test.js
Tests for authentication endpoints:
- User registration with validation
- Login with credential verification
- Token refresh mechanism
- Logout functionality

**Total: 14 tests**

### patient.routes.test.js
Tests for patient management endpoints:
- Patient creation with validation
- Patient listing with pagination
- Search by name/email
- Filter by blood group/gender
- Patient retrieval by ID
- Patient update operations
- Soft delete functionality

**Total: 15 tests**

### appointment.routes.test.js
Tests for appointment management endpoints:
- Appointment booking with slot validation
- Slot conflict detection
- Appointment listing with filters
- Appointment status workflow
- Update operations
- Cancellation functionality

**Total: 16 tests**

## Running Tests

```bash
cd backend

# Run all tests
npm test

# Run specific test file
npm test -- src/routes/__tests__/auth.routes.test.js

# Generate coverage report
npm run test:coverage
```

## Test Coverage

- **Total Tests:** 45+
- **Coverage:** Core API endpoints
- **Status:** ✅ Ready for production
