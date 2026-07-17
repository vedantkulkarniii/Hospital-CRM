# API Endpoints Testing Guide

## Authentication Endpoints

### POST /api/auth/register
**Purpose:** Register a new user

**Test Scenarios:**
- ✅ Valid registration creates user
- ✅ Duplicate email rejected
- ✅ Invalid email format rejected
- ✅ Weak password rejected
- ✅ Required fields validation

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Secure@Password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "patient"
}
```

### POST /api/auth/login
**Purpose:** Authenticate user

**Test Scenarios:**
- ✅ Valid credentials return tokens
- ✅ Invalid password rejected
- ✅ Non-existent user rejected
- ✅ Missing credentials validation
- ✅ JWT tokens properly signed

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Secure@Password123"
}
```

### POST /api/auth/refresh
**Purpose:** Refresh access token

**Test Scenarios:**
- ✅ Valid refresh token returns new access token
- ✅ Invalid refresh token rejected
- ✅ Expired refresh token rejected
- ✅ Token rotation works correctly

```bash
POST http://localhost:5000/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

## Patient Endpoints

### POST /api/patients
**Purpose:** Create new patient

**Test Scenarios:**
- ✅ Valid patient created
- ✅ Required fields validated
- ✅ Authorization checked
- ✅ Data stored correctly

```bash
POST http://localhost:5000/api/patients
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "dateOfBirth": "1990-05-15",
  "gender": "male",
  "bloodGroup": "O+",
  "address": "123 Main St"
}
```

### GET /api/patients
**Purpose:** List patients with pagination

**Test Scenarios:**
- ✅ Returns paginated results
- ✅ Respects limit parameter
- ✅ Respects page parameter
- ✅ Search filter works
- ✅ Blood group filter works
- ✅ Gender filter works

```bash
GET http://localhost:5000/api/patients?page=1&limit=10&search=John&bloodGroup=O%2B&gender=male
Authorization: Bearer {token}
```

### GET /api/patients/:id
**Purpose:** Get patient details

**Test Scenarios:**
- ✅ Returns patient data
- ✅ 404 for non-existent patient
- ✅ Authorization checked

```bash
GET http://localhost:5000/api/patients/507f1f77bcf86cd799439011
Authorization: Bearer {token}
```

### PUT /api/patients/:id
**Purpose:** Update patient

**Test Scenarios:**
- ✅ Updates patient fields
- ✅ 404 for non-existent patient
- ✅ Authorization checked
- ✅ Validation applied

```bash
PUT http://localhost:5000/api/patients/507f1f77bcf86cd799439011
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Jane",
  "phone": "9876543211"
}
```

### DELETE /api/patients/:id
**Purpose:** Soft delete patient

**Test Scenarios:**
- ✅ Marks patient as deleted
- ✅ 404 for non-existent patient
- ✅ Authorization checked
- ✅ Data not actually removed

```bash
DELETE http://localhost:5000/api/patients/507f1f77bcf86cd799439011
Authorization: Bearer {token}
```

## Appointment Endpoints

### POST /api/appointments
**Purpose:** Book appointment

**Test Scenarios:**
- ✅ Valid appointment created
- ✅ Conflict detection works
- ✅ Required fields validated
- ✅ Doctor availability checked
- ✅ Status set to 'scheduled'

```bash
POST http://localhost:5000/api/appointments
Authorization: Bearer {token}
Content-Type: application/json

{
  "patientId": "507f1f77bcf86cd799439011",
  "doctorId": "507f1f77bcf86cd799439012",
  "appointmentDate": "2024-12-25",
  "appointmentTime": "10:00",
  "appointmentType": "consultation",
  "reason": "Regular checkup"
}
```

### GET /api/appointments
**Purpose:** List appointments with filters

**Test Scenarios:**
- ✅ Returns all appointments
- ✅ Filter by status works
- ✅ Filter by doctor works
- ✅ Filter by patient works
- ✅ Filter by date works
- ✅ Pagination works

```bash
GET http://localhost:5000/api/appointments?page=1&limit=10&status=scheduled&doctorId=507f1f77bcf86cd799439012
Authorization: Bearer {token}
```

### GET /api/appointments/:id
**Purpose:** Get appointment details

**Test Scenarios:**
- ✅ Returns appointment data
- ✅ 404 for non-existent appointment
- ✅ Authorization checked

```bash
GET http://localhost:5000/api/appointments/507f1f77bcf86cd799439011
Authorization: Bearer {token}
```

### PUT /api/appointments/:id
**Purpose:** Update appointment

**Test Scenarios:**
- ✅ Updates appointment fields
- ✅ Conflict detection works
- ✅ 404 for non-existent appointment
- ✅ Authorization checked

```bash
PUT http://localhost:5000/api/appointments/507f1f77bcf86cd799439011
Authorization: Bearer {token}
Content-Type: application/json

{
  "appointmentTime": "14:00",
  "reason": "Updated reason"
}
```

### DELETE /api/appointments/:id
**Purpose:** Cancel appointment

**Test Scenarios:**
- ✅ Changes status to 'cancelled'
- ✅ 404 for non-existent appointment
- ✅ Authorization checked

```bash
DELETE http://localhost:5000/api/appointments/507f1f77bcf86cd799439011
Authorization: Bearer {token}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input data",
  "errors": {
    "email": ["Invalid email format"]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```
