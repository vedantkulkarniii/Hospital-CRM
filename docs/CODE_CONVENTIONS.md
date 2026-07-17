# Code Conventions — Hospital CRM

## Naming Conventions

### Files & Folders
```
✅ Good
- models/Patient.js
- controllers/auth.controller.js
- services/appointment.service.js
- middleware/authenticate.js
- utils/logger.js

❌ Bad
- model.js
- authController.js
- service.js
- auth-middleware.js
```

### JavaScript Variables
```javascript
// ✅ Constants
const MAX_RETRY_ATTEMPTS = 3;
const API_TIMEOUT = 5000;

// ✅ Variables (camelCase)
const patientData = { ... };
let currentUser = null;

// ✅ Functions (camelCase, verb-based)
function fetchPatients() {}
async function createAppointment() {}
```

### React Components
```javascript
// ✅ Component files (PascalCase)
function LoginPage() {}
function PatientCard() {}
export default PatientCard;

// ✅ Hooks (camelCase, starting with 'use')
function useAuth() {}
function usePatientData() {}
```

### Database
```javascript
// ✅ Collections (singular, camelCase)
const userSchema = new mongoose.Schema(...);
const patientSchema = new mongoose.Schema(...);

// ✅ Field names (camelCase)
{
  firstName: String,
  dateOfBirth: Date,
  bloodGroup: String,
  medicalHistory: Array
}
```

## Code Style

### Backend (Node.js/Express)

```javascript
// ✅ Imports at top
const express = require('express');
const User = require('../models/User');
const { authenticateUser } = require('../middleware/authenticate');

// ✅ Route handlers
router.get('/users/:id', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Service layer
class UserService {
  async createUser(userData) {
    // Validate data
    if (!userData.email) throw new Error('Email required');
    
    // Create user
    const user = new User(userData);
    await user.save();
    
    return user;
  }
}

// ✅ Error handling
async function handleRequest(req, res, next) {
  try {
    // Logic here
  } catch (error) {
    logger.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}
```

### Frontend (React)

```javascript
// ✅ Imports organized
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import { fetchUsers } from '../store/slices/userSlice';

// ✅ Component structure
export default function UserPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const users = useSelector(state => state.users.list);
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = async () => {
    setLoading(true);
    try {
      await dispatch(fetchUsers());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1>Users</h1>
      {loading && <p>Loading...</p>}
      {users.map(user => <UserCard key={user._id} user={user} />)}
    </div>
  );
}

// ✅ Hooks
function useUserData() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return { data };
}
```

## Documentation

### Comments
```javascript
// ✅ Meaningful comments
// Fetch active users excluding deleted ones
const activeUsers = await User.find({ isDeleted: false });

// ✅ JSDoc for functions
/**
 * Create a new user account
 * @param {Object} userData - User information
 * @param {string} userData.email - User email (required)
 * @param {string} userData.password - User password (required)
 * @returns {Promise<User>} Created user object
 * @throws {Error} If email already exists
 */
async function createUser(userData) {
  // Implementation
}

// ❌ Obvious comments (avoid)
// Set user to loading state
setLoading(true);

// Increment counter
count++;
```

### File Documentation

```javascript
/**
 * User Authentication Service
 * Handles user registration, login, and token management
 * 
 * @module services/auth.service
 * @requires jsonwebtoken
 * @requires bcryptjs
 */

'use strict';

// Implementation
```

## Error Handling

### Backend
```javascript
// ✅ Standardized error responses
{
  success: false,
  message: 'Descriptive error message',
  errors: {
    email: ['Email already exists'],
    password: ['Password must be at least 8 characters']
  }
}

// ✅ Try-catch with logging
try {
  await performOperation();
} catch (error) {
  logger.error('Operation failed:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error'
  });
}
```

### Frontend
```javascript
// ✅ User-friendly error messages
try {
  await apiCall();
} catch (error) {
  const message = error.response?.data?.message || 'Something went wrong';
  toast.error(message);
  console.error('Error:', error);
}
```

## Testing Conventions

### Test File Naming
```
✅ Good
- auth.routes.test.js
- LoginPage.test.jsx
- userService.test.js

❌ Bad
- test.js
- auth-test.js
- user_test.js
```

### Test Structure
```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      // Arrange
      const userData = { email: 'test@example.com', password: 'Test@123' };
      
      // Act
      const user = await UserService.createUser(userData);
      
      // Assert
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
    });
    
    it('should throw error for duplicate email', async () => {
      // Arrange
      const userData = { email: 'existing@example.com', password: 'Test@123' };
      
      // Act & Assert
      expect(async () => {
        await UserService.createUser(userData);
      }).toThrow();
    });
  });
});
```

## Git Conventions

### Commit Messages
```
✅ Good
git commit -m "feat: Add user authentication module"
git commit -m "fix: Resolve password validation error"
git commit -m "docs: Add API documentation"
git commit -m "test: Add user service tests"
git commit -m "refactor: Improve error handling"

❌ Bad
git commit -m "update code"
git commit -m "fix bug"
git commit -m "changes"
```

### Branch Names
```
✅ Good
- feature/user-authentication
- fix/password-reset
- docs/api-documentation
- test/appointment-tests

❌ Bad
- new-feature
- fixbug
- test
- my-branch
```

## Performance Guidelines

### Backend
- Use pagination for large datasets
- Implement query indexing
- Cache frequently accessed data
- Use async/await properly
- Avoid N+1 queries

### Frontend
- Lazy load routes and components
- Memoize expensive computations
- Avoid unnecessary re-renders
- Use production build for deployment
- Monitor bundle size

## Accessibility Guidelines

### HTML/JSX
```javascript
✅ Good
<button aria-label="Close menu">X</button>
<label htmlFor="email">Email</label>
<input id="email" type="email" />

❌ Bad
<button>X</button>
<label>Email</label>
<input type="email" />
```

## Code Review Checklist

- [ ] Follows naming conventions
- [ ] Properly documented
- [ ] Has error handling
- [ ] Includes tests
- [ ] No console.log statements
- [ ] No magic numbers
- [ ] Follows DRY principle
- [ ] Performance optimized
- [ ] Secure implementation
- [ ] Accessibility compliant
