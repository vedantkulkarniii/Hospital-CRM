# 🏥 Hospital CRM System

A production-grade Hospital Customer Relationship Management (CRM) system built with the MERN stack (MongoDB, Express.js, React, Node.js).

---

## Features

- **Authentication** — JWT-based auth with role-based access control (Admin, Doctor, Receptionist, Patient)
- **Patient Management** — Full CRUD with medical history, search, and pagination
- **Doctor Management** — Profiles, specializations, and availability scheduling
- **Appointment Management** — Calendar view, conflict detection, status workflows
- **Prescription Management** — Digital prescriptions with PDF export
- **Billing System** — Invoice generation, payment tracking, PDF export
- **Real-time Notifications** — Socket.IO-powered in-app and email notifications
- **Reports & Analytics** — Revenue, appointments, and demographic reports with charts
- **Inventory Management** — Medical supply tracking with low-stock alerts
- **Role-based Dashboards** — Tailored views for each user role

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API |
| MongoDB + Mongoose | Database |
| JWT + bcryptjs | Authentication |
| Socket.IO | Real-time events |
| Winston | Logging |
| Nodemailer | Email notifications |
| Jest + Supertest | Testing |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework |
| Tailwind CSS | Styling |
| Redux Toolkit | State management |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| Recharts | Data visualization |
| Lucide React | Icons |

---

## Project Structure

```
hospital-crm/
├── backend/
│   ├── src/
│   │   ├── config/        # Database and env config
│   │   ├── controllers/   # Route handler logic
│   │   ├── middleware/    # Auth, error, validation middleware
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express route definitions
│   │   ├── services/      # Business logic layer
│   │   ├── utils/         # Helpers (logger, ApiResponse, JWT)
│   │   ├── app.js         # Express app configuration
│   │   └── server.js      # HTTP server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context (Auth)
│   │   ├── hooks/         # Custom hooks
│   │   ├── layouts/       # Page layout components
│   │   ├── pages/         # Route-level page components
│   │   ├── services/      # Axios API service modules
│   │   ├── store/         # Redux store + slices
│   │   └── utils/         # Frontend helpers
│   └── package.json
└── docs/
    ├── ROADMAP.md
    ├── PROJECT_PROGRESS.md
    └── SPRINT_HISTORY.md
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The API runs on `http://localhost:5000` and the frontend on `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/patients` | List patients |
| POST | `/api/patients` | Create patient |
| GET | `/api/doctors` | List doctors |
| GET | `/api/appointments` | List appointments |
| POST | `/api/appointments` | Book appointment |
| GET | `/api/dashboard/stats` | Dashboard statistics |

*(Full API documentation coming in future sprints)*

---

## Development Roadmap

See [docs/ROADMAP.md](./docs/ROADMAP.md) for the complete 220-task roadmap.

---

## License

MIT © vedantkulkarniii
