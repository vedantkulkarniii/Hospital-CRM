# Testing Setup & Execution Guide

## Backend Integration Testing

### Files Created
```
backend/src/routes/__tests__/
├── auth.routes.test.js         # Auth endpoint tests (register, login, refresh, logout)
├── patient.routes.test.js      # Patient CRUD endpoint tests
└── appointment.routes.test.js  # Appointment booking & management tests
```

### Backend Test Infrastructure (Already in place)
```
backend/
├── jest.config.js              # Jest configuration
├── jest.setup.js               # Test environment setup
└── package.json                # Test scripts
```

### Running Backend Tests

```bash
# Navigate to backend
cd backend

# Run all tests
npm test

# Run specific test file
npm test -- src/routes/__tests__/auth.routes.test.js

# Run with coverage report
npm run test:coverage

# Watch mode (re-run on file changes)
npm test -- --watch
```

### Backend Test Coverage

- **Authentication Routes (14 tests)**
  - User registration with validation
  - User login with credential verification
  - Token refresh mechanism
  - Logout functionality
  
- **Patient Routes (15 tests)**
  - Create patient with validation
  - List patients with pagination & filters
  - Search patients by name/email
  - Filter by blood group/gender
  - Get patient by ID
  - Update patient information
  - Soft delete patient
  
- **Appointment Routes (16 tests)**
  - Book appointment with slot validation
  - Detect overlapping appointments
  - List appointments with filters
  - Get appointment details
  - Update appointment
  - Cancel appointment with status change

---

## Frontend Component Testing

### Files Created

**Vitest Configuration:**
```
frontend/
├── vitest.config.js            # Vitest configuration (jsdom, coverage, paths)
└── package.json                # Updated with test scripts & dependencies
```

**Test Setup:**
```
frontend/src/__tests__/
└── setup.js                    # Global test setup (mocks, utilities)
```

**Component Tests:**
```
frontend/src/pages/auth/__tests__/
└── LoginPage.test.jsx          # Login page component tests (14 tests)

frontend/src/pages/dashboard/__tests__/
└── PatientsPage.test.jsx       # Patients list page tests (15 tests)

frontend/src/components/appointments/__tests__/
└── AppointmentForm.test.jsx    # Appointment form modal tests (18 tests)
```

### Frontend Test Infrastructure Setup

**Dependencies Added to package.json:**
```json
{
  "devDependencies": {
    "vitest": "^1.1.3",
    "@testing-library/react": "^15.0.0",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "jsdom": "^23.0.1",
    "@vitest/ui": "^1.1.3"
  }
}
```

**NPM Scripts Added:**
```json
{
  "scripts": {
    "test": "vitest --run",
    "test:watch": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

### Running Frontend Tests

```bash
# Navigate to frontend
cd frontend

# Install dependencies (required for React 19 compatibility)
npm install --legacy-peer-deps

# Run all tests once
npm test

# Run tests in watch mode (re-run on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Open test UI (visual test runner)
npx vitest --ui
```

### Frontend Test Coverage

- **LoginPage (14 tests)**
  - Form rendering with fields
  - Client-side validation
  - Error message display
  - Form submission
  - Password visibility toggle
  - Navigation links
  - Loading state
  - Error clearing on user input
  
- **PatientsPage (15 tests)**
  - Patient list rendering
  - Display patient data in table
  - Search functionality
  - Filter by gender/blood group
  - Action buttons (view, edit, delete)
  - Modal interactions
  - Pagination
  - Error handling
  - Loading states
  
- **AppointmentForm (18 tests)**
  - Modal opening/closing
  - Form field rendering
  - Appointment type selection
  - Form submission
  - Loading state
  - Error handling
  - Pre-population with data
  - User input handling
  - Dropdown verification

---

## Test Execution Examples

### Backend Example: Run Auth Route Tests
```bash
cd backend
npm test -- src/routes/__tests__/auth.routes.test.js

# Output:
# PASS src/routes/__tests__/auth.routes.test.js
#   Auth Routes Integration Tests
#     POST /api/auth/register
#       ✓ should register a new user with valid data (45ms)
#       ✓ should return 400 for invalid email (12ms)
#       ✓ should return 400 for duplicate email (38ms)
#       ✓ should return 400 for weak password (8ms)
#     POST /api/auth/login
#       ✓ should login with valid credentials (52ms)
#       ✓ should return 401 for incorrect password (28ms)
#       ✓ should return 404 for non-existent user (15ms)
#       ✓ should return 400 for missing email or password (10ms)
#     ... (and more)
```

### Frontend Example: Run Component Tests
```bash
cd frontend
npm test

# Output:
# ✓ src/pages/auth/__tests__/LoginPage.test.jsx (14)
#   LoginPage Component
#     ✓ should render login form with email and password fields
#     ✓ should display validation errors for empty form submission
#     ✓ should display email validation error for invalid email
#     ✓ should call login function with form data on valid submission
#     ... (and more)
#
# ✓ src/pages/dashboard/__tests__/PatientsPage.test.jsx (15)
#   PatientsPage Component
#     ✓ should render patients page with table
#     ✓ should display list of patients
#     ... (and more)
#
# Test Files  3 passed (3)
#      Tests  47 passed (47)
```

---

## Testing Best Practices Used

### Backend Integration Tests
- **Isolation**: Each test is independent with proper setup/teardown
- **Database Cleanup**: `afterEach` clears test data
- **Realistic Scenarios**: Tests use actual API endpoints via supertest
- **Error Coverage**: Tests both success and failure paths
- **Authentication**: Tests JWT tokens and authorization

### Frontend Component Tests
- **Accessibility First**: Use `getByRole`, `getByLabelText` instead of test IDs
- **User Behavior**: Simulate actual user interactions with `userEvent`
- **Mock Dependencies**: Mock services, hooks, and child components
- **Async Handling**: Proper use of `waitFor` for async operations
- **Clean State**: Each test runs in isolation with fresh state

---

## Troubleshooting

### Backend Tests Failing to Connect to MongoDB
```bash
# Ensure MongoDB is running locally on 27017 or set MONGODB_URI
# Tests use mongodb://localhost:27017/hospital-crm-test by default

# Check jest.setup.js for test database configuration
```

### Frontend Tests: React 19 Compatibility
```bash
# If npm install fails due to peer dependency conflicts:
npm install --legacy-peer-deps

# This allows React 19 to work with @testing-library/react@15
```

### Frontend Tests Not Finding Setup File
```bash
# Ensure vitest.config.js is in the root of frontend directory
# and setupFiles points to correct path:
setupFiles: ['./src/__tests__/setup.js']
```

### Tests Timeout
```bash
# Increase timeout for slow tests:
# In test file:
describe('Suite', () => {
  it('slow test', async () => {
    // ...
  }, 10000); // 10 second timeout
});
```

---

## Coverage Report

After running tests with coverage:

```bash
# Backend
npm run test:coverage

# Frontend
npm run test:coverage

# View HTML reports in:
# - backend/coverage/lcov-report/index.html
# - frontend/coverage/lcov-report/index.html
```

---

## Continuous Integration Ready

Both test suites are ready for CI/CD integration:

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm install && npm test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install --legacy-peer-deps && npm test
```

---

## Next Testing Improvements

### Phase 13 & 14 Recommendations
1. Add E2E tests with Playwright/Cypress
2. Add React Query tests for data fetching
3. Add Redux selector tests
4. Add service layer unit tests
5. Achieve 80%+ code coverage
6. Set up code coverage gates in CI/CD

---

*For detailed information, see PHASE_12_TESTING_SUMMARY.md*
