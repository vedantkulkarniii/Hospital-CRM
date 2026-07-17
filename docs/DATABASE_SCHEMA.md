# Database Schema — Hospital CRM

## Collections Overview

### 1. Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  role: Enum(['admin', 'doctor', 'receptionist', 'patient']),
  isActive: Boolean (default: true),
  lastLogin: Date,
  refreshTokens: [{
    token: String,
    expiresAt: Date,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date,
  isDeleted: Boolean (default: false)
}
```

### 2. Patients Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  firstName: String (required),
  lastName: String (required),
  email: String (unique),
  phone: String,
  dateOfBirth: Date,
  gender: Enum(['male', 'female', 'other']),
  bloodGroup: Enum(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']),
  address: String,
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    status: Enum(['active', 'resolved']),
    notes: String
  }],
  allergies: [String],
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  createdAt: Date,
  updatedAt: Date,
  isDeleted: Boolean (default: false)
}
```

### 3. Doctors Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  specialization: String (required),
  qualifications: [String],
  licenseNumber: String (unique),
  experience: Number,
  consultationFee: Number,
  availability: {
    monday: { startTime: String, endTime: String },
    tuesday: { startTime: String, endTime: String },
    wednesday: { startTime: String, endTime: String },
    thursday: { startTime: String, endTime: String },
    friday: { startTime: String, endTime: String },
    saturday: { startTime: String, endTime: String },
    sunday: { startTime: String, endTime: String }
  },
  rating: Number (default: 0),
  totalPatients: Number (default: 0),
  createdAt: Date,
  updatedAt: Date,
  isDeleted: Boolean (default: false)
}
```

### 4. Appointments Collection

```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patient, required),
  doctorId: ObjectId (ref: Doctor, required),
  appointmentDate: Date (required),
  appointmentTime: String (required, HH:MM format),
  appointmentType: Enum(['consultation', 'follow-up', 'checkup', 'treatment']),
  reason: String,
  notes: String,
  status: Enum(['scheduled', 'confirmed', 'completed', 'cancelled'], default: 'scheduled'),
  cancelledBy: String,
  cancelledReason: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date,
  isDeleted: Boolean (default: false)
}
```

### 5. Prescriptions Collection

```javascript
{
  _id: ObjectId,
  appointmentId: ObjectId (ref: Appointment),
  patientId: ObjectId (ref: Patient, required),
  doctorId: ObjectId (ref: Doctor, required),
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  diagnosis: String,
  notes: String,
  followUpDate: Date,
  issuedDate: Date,
  createdAt: Date,
  updatedAt: Date,
  isDeleted: Boolean (default: false)
}
```

### 6. Bills Collection

```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patient, required),
  appointmentId: ObjectId (ref: Appointment),
  consultationFee: Number,
  medicationCost: Number,
  labTestCost: Number,
  otherCharges: Number,
  subtotal: Number,
  discount: Number (default: 0),
  taxPercentage: Number (default: 0),
  totalAmount: Number,
  status: Enum(['pending', 'paid', 'overdue'], default: 'pending'),
  dueDate: Date,
  paymentDate: Date,
  paymentMethod: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date,
  isDeleted: Boolean (default: false)
}
```

### 7. Notifications Collection

```javascript
{
  _id: ObjectId,
  recipient: ObjectId (ref: User, required),
  type: Enum(['appointment_booked', 'appointment_confirmed', 'bill_generated', ...]),
  title: String (required),
  message: String (required),
  relatedEntity: {
    entityType: Enum(['appointment', 'prescription', 'bill', 'patient', 'doctor']),
    entityId: ObjectId
  },
  channels: {
    inApp: Boolean (default: true),
    email: Boolean (default: false),
    sms: Boolean (default: false),
    push: Boolean (default: false)
  },
  deliveryStatus: {
    inApp: { status: String, deliveredAt: Date, failureReason: String },
    email: { status: String, sentAt: Date, failureReason: String },
    sms: { status: String, sentAt: Date, failureReason: String },
    push: { status: String, sentAt: Date, failureReason: String }
  },
  isRead: Boolean (default: false),
  readAt: Date,
  priority: Enum(['low', 'medium', 'high', 'urgent']),
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date,
  isDeleted: Boolean (default: false)
}
```

### 8. Inventory Collection

```javascript
{
  _id: ObjectId,
  itemName: String (required),
  itemCode: String (unique, required),
  category: String (required),
  quantity: Number (required),
  unit: String (required),
  costPrice: Number,
  sellingPrice: Number,
  supplier: String,
  expiryDate: Date,
  status: Enum(['in-stock', 'low-stock', 'out-of-stock', 'expired']),
  reorderLevel: Number,
  lastRestockDate: Date,
  alerts: [{
    type: Enum(['low-stock', 'expiry', 'out-of-stock']),
    message: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date,
  isDeleted: Boolean (default: false)
}
```

### 9. Analytics Collection

```javascript
{
  _id: ObjectId,
  type: String (required),
  date: Date,
  data: Object, // Flexible schema for different report types
  summary: {
    totalAppointments: Number,
    totalPatients: Number,
    totalDoctors: Number,
    totalRevenue: Number,
    averageRating: Number
  },
  filters: Object,
  format: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes

### Users Collection
```javascript
db.users.createIndex({ email: 1 })
db.users.createIndex({ isDeleted: 1 })
db.users.createIndex({ createdAt: -1 })
```

### Patients Collection
```javascript
db.patients.createIndex({ userId: 1 })
db.patients.createIndex({ phone: 1 })
db.patients.createIndex({ isDeleted: 1 })
db.patients.createIndex({ email: 1 })
```

### Appointments Collection
```javascript
db.appointments.createIndex({ patientId: 1 })
db.appointments.createIndex({ doctorId: 1 })
db.appointments.createIndex({ appointmentDate: 1 })
db.appointments.createIndex({ status: 1 })
db.appointments.createIndex({ patientId: 1, appointmentDate: 1 })
```

### Bills Collection
```javascript
db.bills.createIndex({ patientId: 1 })
db.bills.createIndex({ status: 1 })
db.bills.createIndex({ createdAt: -1 })
db.bills.createIndex({ dueDate: 1 })
```

## Relationships

```
User (1) ──── (N) Patient
User (1) ──── (1) Doctor
Doctor (1) ──── (N) Appointment ──── (N) Patient
Appointment (1) ──── (1) Prescription
Appointment (1) ──── (1) Bill
Bill (N) ──── (1) Patient
Notification (N) ──── (1) User
Inventory (1) ──── (N) Alerts
```

## Data Integrity Rules

1. **Cascade Delete**: When user is deleted, related doctor profile is also deleted
2. **Soft Delete**: Medical data is soft-deleted (marked as deleted, not removed)
3. **Referential Integrity**: All foreign keys must exist
4. **Unique Constraints**: Email, phone, license number are unique
5. **Required Fields**: Validated at model and database level

## Backup Strategy

- Daily automated backups
- 30-day retention period
- Encrypted backup storage
- Point-in-time recovery enabled
- Monthly full backups archived
