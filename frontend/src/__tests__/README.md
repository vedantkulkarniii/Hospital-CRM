# Frontend Component Tests

This directory contains setup and configuration for React component testing using Vitest.

## Files

### setup.js
Global test environment setup:
- @testing-library/jest-dom integration
- window.matchMedia mock for responsive testing
- localStorage/sessionStorage mocks
- Console error/warn suppression

## Running Tests

```bash
cd frontend

# Install dependencies (first time only)
npm install --legacy-peer-deps

# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test Coverage

### Pages Tests
- **LoginPage.test.jsx:** 14 tests for authentication UI
- **PatientsPage.test.jsx:** 15 tests for patient management UI

### Component Tests
- **AppointmentForm.test.jsx:** 18 tests for appointment form

**Total: 47+ component tests**

## Best Practices

✅ Query by role/label (not test IDs)  
✅ Async/await for user interactions  
✅ Mock external dependencies  
✅ Test accessibility compliance  
✅ User-centric test scenarios  
✅ Redux store integration testing
