# 🔐 Test Credentials for Hospital CRM

Use these credentials to test the application with different user roles.

## How to Generate Test Data

Run the seed script to create test users:

```bash
cd backend
npm run seed
```

This will create 4 test users with different roles and their associated profiles.

---

## 📧 Test Accounts

| Role | Email | Password | Role Details |
|---|---|---|---|
| **Admin** | `admin@hospital.com` | `Admin@123` | Full system access, manage all users and records |
| **Doctor** | `doctor@hospital.com` | `Doctor@123` | View patients, manage appointments, write prescriptions |
| **Receptionist** | `receptionist@hospital.com` | `Receptionist@123` | Manage appointments, patient check-ins, billing |
| **Patient** | `patient@hospital.com` | `Patient@123` | Book appointments, view medical history, prescriptions |

---

## 🏥 Created Profiles

### Doctor Profile
- **Name**: Dr. Rajesh Kumar
- **Specialization**: Cardiology
- **Experience**: 8 years
- **Consultation Fee**: ₹500
- **License**: LIC-INDIA-2015-98765
- **Availability**: Monday–Friday (9:00–17:00), Saturday (10:00–14:00)

### Patient Profile
- **Name**: John Patient
- **DOB**: 1990-05-15
- **Blood Group**: O+
- **Address**: Delhi, India

---

## 🚀 Testing Workflow

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Test Each Role**
   - Login with each user
   - Verify dashboard displays role-appropriate content
   - Test CRUD operations for patients/doctors/appointments

---

## ✅ Verification Checklist

- [ ] Admin can view all users and manage system
- [ ] Doctor can view patient list and appointments
- [ ] Receptionist can manage appointments and billing
- [ ] Patient can book appointments and view profile
- [ ] Doctor profile shows specialization and availability
- [ ] Patient profile displays medical history

---

## 📝 Notes

- All passwords follow: `{Role}@123` pattern
- Database must be running (MongoDB on `mongodb://localhost:27017`)
- Test data is created fresh each time seed script runs (existing test users are cleared)
- To reset, run `npm run seed` again

---

*Generated for Hospital CRM testing — Phase 5 Complete*
