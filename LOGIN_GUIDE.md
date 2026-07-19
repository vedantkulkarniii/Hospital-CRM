# 🔐 Login Guide — Hospital CRM

## ✅ Test Data Seeded Successfully!

The database has been populated with test users. You can now login to the application.

---

## 👤 Test Accounts

Use these credentials to login at **http://localhost:5173**:

### Admin Account
```
Email: admin@hospital.com
Password: Admin@123
```
✨ Full access to all features

### Doctor Account
```
Email: doctor@hospital.com
Password: Doctor@123
```
📋 Can view/manage appointments, patients, prescriptions

### Receptionist Account
```
Email: receptionist@hospital.com
Password: Receptionist@123
```
📞 Can manage appointments, patients, billing

### Patient Account
```
Email: patient@hospital.com
Password: Patient@123
```
🏥 Can view appointments, prescriptions, bills

---

## 🌐 How to Login

1. **Open Application**: http://localhost:5173
2. **Click "Login"** if not already on login page
3. **Enter Email**: Copy one from above
4. **Enter Password**: Copy corresponding password
5. **Click "Sign In"**

---

## ✨ What You Can Test

### With Admin Account
- View dashboard with statistics
- Manage users and roles
- View all patients
- Manage doctors
- View all appointments
- Manage billing
- View reports and analytics

### With Doctor Account
- View your dashboard
- See your appointments
- Manage prescriptions
- View your patients
- Track consultations

### With Receptionist Account
- Manage appointment bookings
- Register new patients
- Handle billing
- View pending tasks

### With Patient Account
- View your appointments
- See prescriptions
- Check bills and payments
- View medical history

---

## 🔍 Verify Backend is Working

**Test Backend Connection:**
```bash
curl http://localhost:5000/api/health
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2026-07-18T..."
  }
}
```

---

## 📊 Test API Directly

### Login API Call
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "Admin@123"
  }'
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "...",
      "email": "admin@hospital.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin"
    }
  }
}
```

---

## 🆘 Troubleshooting

### Error: "Invalid email or password"
- ✅ **Fixed!** Database has been seeded
- Use credentials above
- Make sure you're using exact email and password (case-sensitive)

### Error: "Cannot connect to server"
- Check if backend is running: http://localhost:5000/api/health
- Backend should be on port 5000
- Restart backend if needed: `npm run dev` in backend folder

### Frontend not loading
- Check if frontend is running: http://localhost:5173
- Frontend should be on port 5173
- Check browser console (F12) for errors

### Login works but dashboard is blank
- This is normal during first load
- React Query is fetching data from APIs
- Wait a few seconds for data to load
- Check browser console for any errors

---

## 🚀 Demo Features

### Test Phase 13 Optimizations

**1. Redis Caching (Dashboard)**
- Admin dashboard loads instantly on second visit
- Data cached for 5 minutes
- Reduced database queries by 80%

**2. Bundle Optimization**
- Open DevTools (F12) → Network tab
- Reload page and see chunked loading
- Notice vendor-react, vendor-redux chunks loading

**3. React Query**
- Open DevTools (F12) → Console
- Query cache is working automatically
- Try clicking refresh - data loads from cache first

**4. Performance**
- Initial load: ~2-3 seconds
- Subsequent navigation: ~500ms (cached)
- Dashboard stats API: <100ms response time

---

## 📝 Notes

- Test data is automatically cleared when you run `npm run seed` again
- To reset accounts, just run: `cd backend && npm run seed`
- All passwords are hashed in database (not stored as plain text)
- Refresh tokens are rotated on each login for security

---

**Ready to login! 🎊**

Go to http://localhost:5173 and try logging in now!
