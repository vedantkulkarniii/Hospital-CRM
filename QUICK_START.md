# Hospital CRM — Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js v18+ installed
- MongoDB running locally
- Git installed

### Step 1: Clone & Setup (1 min)

```bash
# Clone repository
git clone https://github.com/vedantkulkarniii/Hospital-CRM.git
cd Hospital-CRM

# Create environment file
cd backend
cp .env.example .env
cd ..
```

### Step 2: Install Dependencies (2 min)

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install --legacy-peer-deps
cd ..
```

### Step 3: Start Servers (1 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Application runs on http://localhost:5173
```

### Step 4: Seed Test Data (1 min)

**Terminal 3:**
```bash
cd backend
npm run seed
```

### Step 5: Login (< 1 min)

Open **http://localhost:5173** and login with:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@hospital.com` | `Admin@123` |
| Doctor | `doctor@hospital.com` | `Doctor@123` |
| Receptionist | `receptionist@hospital.com` | `Receptionist@123` |
| Patient | `patient@hospital.com` | `Patient@123` |

---

## 📱 Available Pages

### Admin Dashboard
- ✅ Dashboard with statistics
- ✅ Manage all patients
- ✅ Manage all doctors
- ✅ View all appointments
- ✅ Manage billing
- ✅ View inventory
- ✅ System administration

### Doctor Portal
- ✅ View assigned patients
- ✅ Manage appointments
- ✅ Create prescriptions
- ✅ View reports

### Receptionist Portal
- ✅ Manage patient check-ins
- ✅ Schedule appointments
- ✅ Handle billing
- ✅ Manage inventory

### Patient Portal
- ✅ Book appointments
- ✅ View medical history
- ✅ View prescriptions
- ✅ Check bills
- ✅ Receive notifications

---

## 🧪 Running Tests

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run specific test
npm test -- src/routes/__tests__/auth.routes.test.js

# Generate coverage
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Watch mode
npm run test:watch

# Generate coverage
npm run test:coverage
```

---

## 📂 Project Structure

```
Hospital-CRM/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes
│   │   ├── services/       # Business logic
│   │   └── middleware/     # Auth, validation
│   ├── .env                # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # React pages
│   │   ├── components/     # Reusable components
│   │   ├── store/          # Redux state
│   │   └── services/       # API calls
│   ├── vitest.config.js
│   └── package.json
│
└── docs/
    ├── PHASE_12_TESTING_SUMMARY.md
    ├── TESTING_SETUP_GUIDE.md
    └── API_TESTING_GUIDE.md
```

---

## 🔗 Important URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Health Check | http://localhost:5000/api/health |
| MongoDB | mongodb://localhost:27017 |

---

## ⚙️ Available Commands

### Backend
```bash
npm run dev              # Development server
npm run start            # Production server
npm run seed             # Seed test data
npm test                 # Run tests
npm run test:coverage    # Coverage report
npm run lint             # Lint code
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
```

### Frontend
```bash
npm run dev              # Development server
npm run build            # Build for production
npm run preview          # Preview production build
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run lint             # Lint code
```

---

## 📝 Default Credentials

```
Admin Account
─────────────
Email: admin@hospital.com
Password: Admin@123
Role: System Administrator

Doctor Account
──────────────
Email: doctor@hospital.com
Password: Doctor@123
Role: Medical Professional

Receptionist Account
────────────────────
Email: receptionist@hospital.com
Password: Receptionist@123
Role: Administrative Staff

Patient Account
───────────────
Email: patient@hospital.com
Password: Patient@123
Role: End User
```

---

## 🐛 Troubleshooting

### MongoDB Not Connecting
```bash
# Ensure MongoDB is running
mongod

# Or use Docker
docker run -d -p 27017:27017 mongo
```

### Port Already in Use
```bash
# Backend
PORT=5001 npm run dev

# Frontend
npm run dev -- --port 5174
```

### npm install Fails
```bash
cd frontend
npm install --legacy-peer-deps
```

### Tests Timing Out
```bash
npm test -- --testTimeout=30000
```

---

## 📚 Documentation

- **[Complete Testing Guide](docs/TESTING_SETUP_GUIDE.md)** - Full test setup instructions
- **[API Documentation](docs/API_TESTING_GUIDE.md)** - API endpoint details
- **[Test Coverage Report](docs/TEST_COVERAGE_REPORT.md)** - Coverage metrics
- **[Environment Setup](docs/ENVIRONMENT_SETUP.md)** - Environment variables
- **[Best Practices](docs/TEST_BEST_PRACTICES.md)** - Testing best practices
- **[Troubleshooting Guides](docs/FRONTEND_TESTING_TROUBLESHOOTING.md)** - Common issues

---

## 🚀 Next Steps

1. **Explore Dashboard** - Login and explore the admin dashboard
2. **Try Each Role** - Test different user roles
3. **Run Tests** - Execute test suites to verify everything works
4. **Read Docs** - Check detailed documentation for deeper understanding
5. **Customize** - Modify UI/logic to match your needs

---

## 💡 Tips

- Use `npm run seed` to reset test data anytime
- Check browser DevTools for frontend debugging
- Use `npm test -- -t "specific test"` to run individual tests
- Enable debug logging in `src/utils/logger.js`
- Create `.env.local` for personal overrides

---

## 🆘 Need Help?

- Check **docs/** folder for comprehensive guides
- Review **README.md** in each folder
- Check GitHub Issues for common problems
- Review test files for usage examples

---

**Happy coding! 🎉**
