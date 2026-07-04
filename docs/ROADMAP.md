# Hospital CRM System — Full Project Roadmap
> 200+ tasks across 14 phases. This is the single source of truth for all planned work.

---

## PHASE 1 — Project Setup

- [x] T-001 Initialize Git repository
- [x] T-002 Configure remote origin (GitHub)
- [x] T-003 Create root .gitignore
- [x] T-004 Initialize Node.js backend (npm init)
- [x] T-005 Initialize React frontend (Vite)
- [x] T-006 Configure ESLint (backend)
- [x] T-007 Configure Prettier (backend)
- [ ] T-008 Configure ESLint (frontend)
- [ ] T-009 Configure Prettier (frontend)
- [x] T-010 Set up folder structure (backend: src/controllers, services, models, routes, middleware, utils, config)
- [x] T-011 Set up folder structure (frontend: src/components, pages, hooks, services, store, utils, assets)
- [x] T-012 Install and configure Express.js
- [x] T-013 Install and configure MongoDB + Mongoose
- [x] T-014 Create .env.example file
- [x] T-015 Configure dotenv
- [x] T-016 Create base server.js entry point
- [x] T-017 Create base app.js with middleware stack
- [x] T-018 Configure CORS policy
- [x] T-019 Configure Morgan HTTP logger
- [x] T-020 Configure Winston logger (file + console transport)
- [x] T-021 Create global error handler middleware
- [x] T-022 Create 404 not-found handler
- [x] T-023 Set up MongoDB connection utility
- [x] T-024 Create health-check route GET /api/health
- [x] T-025 Create README.md with project overview
- [x] T-026 Create CHANGELOG.md
- [x] T-027 Create docs/PROJECT_PROGRESS.md
- [x] T-028 Create docs/SPRINT_HISTORY.md
- [x] T-029 Configure Tailwind CSS (frontend)
- [x] T-030 Configure React Router DOM

---

## PHASE 2 — Authentication

- [x] T-031 Create User schema (Mongoose)
- [x] T-032 Add role enum to User schema (admin, doctor, receptionist, patient)
- [x] T-033 Add password hashing pre-save hook (bcrypt)
- [x] T-034 Create auth service — register function
- [x] T-035 Create auth service — login function
- [x] T-036 Create auth service — token refresh function
- [x] T-037 Create JWT utility (sign + verify)
- [x] T-038 Create auth controller (register, login, logout, refresh)
- [x] T-039 Create auth routes POST /api/auth/register
- [x] T-040 Create auth routes POST /api/auth/login
- [x] T-041 Create auth routes POST /api/auth/logout
- [x] T-042 Create auth routes POST /api/auth/refresh
- [x] T-043 Create authenticate middleware (JWT verification)
- [x] T-044 Create authorize middleware (role-based access)
- [x] T-045 Add input validation (express-validator) for auth routes
- [x] T-046 Implement refresh token rotation (store in DB)
- [ ] T-047 Create frontend auth context (React Context API)
- [ ] T-048 Create Login page UI
- [ ] T-049 Create Register page UI
- [ ] T-050 Implement protected route component
- [x] T-051 Create auth API service (axios)
- [x] T-052 Implement token auto-refresh interceptor (axios)
- [x] T-053 Create logout functionality + clear tokens
- [x] T-054 Add forgot-password route + email token generation
- [x] T-055 Add reset-password route + token verification

---

## PHASE 3 — Dashboard ✅

- [x] T-056 Create dashboard layout component (sidebar + topbar)
- [x] T-057 Create responsive sidebar with navigation links
- [x] T-058 Create topbar with user info + logout
- [x] T-059 Create stats card component
- [x] T-060 Create GET /api/dashboard/stats route
- [x] T-061 Create dashboard service (aggregate counts: patients, doctors, appointments today)
- [x] T-062 Implement recent appointments widget
- [x] T-063 Implement recent patients widget
- [x] T-064 Create area chart component (appointments trend — last 7 days)
- [x] T-065 Create pie chart component (appointment status breakdown)
- [x] T-066 Implement role-based dashboard views (admin vs doctor vs receptionist)
- [x] T-067 Add loading skeletons for dashboard cards

---

## PHASE 4 — Patient Management

- [x] T-068 Create Patient schema (name, dob, gender, contact, address, bloodGroup, medicalHistory, createdBy)
- [x] T-069 Create patient service — createPatient
- [x] T-070 Create patient service — getPatients (pagination + search + filter)
- [x] T-071 Create patient service — getPatientById
- [x] T-072 Create patient service — updatePatient
- [x] T-073 Create patient service — deletePatient (soft delete)
- [x] T-074 Create patient controller
- [x] T-075 Create patient routes (CRUD)
- [x] T-076 Add input validation for patient routes
- [x] T-077 Create patient list page (frontend) with table + pagination
- [x] T-078 Create patient search + filter bar
- [x] T-079 Create add patient modal / form
- [x] T-080 Create edit patient modal / form
- [x] T-081 Create patient detail page
- [x] T-082 Create patient medical history section
- [x] T-083 Implement patient API service (axios)
- [x] T-084 Add patient state management (Redux Toolkit slice)

---

## PHASE 5 — Doctor Management

- [ ] T-085 Create Doctor schema (userId ref, specialization, qualification, experience, availability, consultationFee)
- [ ] T-086 Create doctor service — createDoctor
- [ ] T-087 Create doctor service — getDoctors (pagination + filter by specialization)
- [ ] T-088 Create doctor service — getDoctorById
- [ ] T-089 Create doctor service — updateDoctor
- [ ] T-090 Create doctor service — deleteDoctor (soft delete)
- [ ] T-091 Create doctor controller
- [ ] T-092 Create doctor routes (CRUD)
- [ ] T-093 Create doctor list page (frontend)
- [ ] T-094 Create doctor profile card component
- [ ] T-095 Create add/edit doctor form
- [ ] T-096 Create doctor detail page with schedule view
- [ ] T-097 Implement doctor availability scheduler UI
- [ ] T-098 Add doctor API service (axios)
- [ ] T-099 Add doctor state (Redux Toolkit slice)

---

## PHASE 6 — Appointment Management

- [ ] T-100 Create Appointment schema (patient, doctor, date, time, type, status, notes, createdBy)
- [ ] T-101 Create appointment service — createAppointment
- [ ] T-102 Create appointment service — getAppointments (pagination + filters: date, doctor, patient, status)
- [ ] T-103 Create appointment service — getAppointmentById
- [ ] T-104 Create appointment service — updateAppointment
- [ ] T-105 Create appointment service — cancelAppointment
- [ ] T-106 Add conflict detection (overlapping slots)
- [ ] T-107 Create appointment controller
- [ ] T-108 Create appointment routes
- [ ] T-109 Create appointment list page (frontend)
- [ ] T-110 Create appointment calendar view (FullCalendar or custom)
- [ ] T-111 Create book appointment modal
- [ ] T-112 Create appointment detail view
- [ ] T-113 Implement appointment status workflow (scheduled → confirmed → completed → cancelled)
- [ ] T-114 Add appointment API service (axios)
- [ ] T-115 Add appointment state (Redux Toolkit slice)

---

## PHASE 7 — Prescription Management

- [ ] T-116 Create Prescription schema (appointment ref, patient, doctor, medications[], diagnosis, notes, date)
- [ ] T-117 Create Medication sub-schema (name, dosage, frequency, duration, instructions)
- [ ] T-118 Create prescription service — createPrescription
- [ ] T-119 Create prescription service — getPrescriptions
- [ ] T-120 Create prescription service — getPrescriptionById
- [ ] T-121 Create prescription service — updatePrescription
- [ ] T-122 Create prescription controller
- [ ] T-123 Create prescription routes
- [ ] T-124 Create prescription form UI (add medications dynamically)
- [ ] T-125 Create prescription detail view
- [ ] T-126 Implement PDF export for prescription (pdfkit or puppeteer)
- [ ] T-127 Add prescription API service (axios)

---

## PHASE 8 — Billing System

- [ ] T-128 Create Invoice schema (patient, doctor, appointment, items[], subtotal, tax, discount, total, status, paidAt)
- [ ] T-129 Create InvoiceItem sub-schema (description, quantity, unitPrice, total)
- [ ] T-130 Create billing service — createInvoice
- [ ] T-131 Create billing service — getInvoices (pagination + filter by status)
- [ ] T-132 Create billing service — getInvoiceById
- [ ] T-133 Create billing service — updateInvoice
- [ ] T-134 Create billing service — markAsPaid
- [ ] T-135 Create billing controller
- [ ] T-136 Create billing routes
- [ ] T-137 Create invoice list page (frontend)
- [ ] T-138 Create invoice detail + print view
- [ ] T-139 Implement PDF invoice export
- [ ] T-140 Create payment summary stats widget
- [ ] T-141 Add billing API service (axios)
- [ ] T-142 Add billing state (Redux Toolkit slice)

---

## PHASE 9 — Notification System

- [ ] T-143 Create Notification schema (recipient, type, title, message, read, createdAt)
- [ ] T-144 Create notification service — createNotification
- [ ] T-145 Create notification service — getUserNotifications
- [ ] T-146 Create notification service — markAsRead
- [ ] T-147 Create notification service — markAllAsRead
- [ ] T-148 Create notification controller
- [ ] T-149 Create notification routes
- [ ] T-150 Integrate Socket.IO (backend setup)
- [ ] T-151 Integrate Socket.IO (frontend setup)
- [ ] T-152 Emit real-time notification on new appointment booking
- [ ] T-153 Emit real-time notification on appointment status change
- [ ] T-154 Create notification bell component (frontend)
- [ ] T-155 Create notification dropdown list
- [ ] T-156 Configure Nodemailer for email notifications
- [ ] T-157 Send email on appointment confirmation
- [ ] T-158 Send email on appointment cancellation

---

## PHASE 10 — Reports & Analytics

- [ ] T-159 Create reports service — monthly appointment report
- [ ] T-160 Create reports service — revenue report (monthly/yearly)
- [ ] T-161 Create reports service — doctor performance report
- [ ] T-162 Create reports service — patient demographics report
- [ ] T-163 Create reports controller
- [ ] T-164 Create reports routes
- [ ] T-165 Create analytics dashboard page (frontend)
- [ ] T-166 Implement bar chart — monthly revenue
- [ ] T-167 Implement line chart — appointment trends
- [ ] T-168 Implement pie chart — patient demographics (age/gender)
- [ ] T-169 Implement table — top doctors by appointments
- [ ] T-170 Add date range filter for reports
- [ ] T-171 Implement CSV export for reports

---

## PHASE 11 — Inventory Management

- [ ] T-172 Create InventoryItem schema (name, category, quantity, unit, reorderLevel, supplier, price)
- [ ] T-173 Create inventory service — addItem
- [ ] T-174 Create inventory service — getItems (pagination + filter)
- [ ] T-175 Create inventory service — updateItem
- [ ] T-176 Create inventory service — deleteItem (soft delete)
- [ ] T-177 Create inventory service — getLowStockItems
- [ ] T-178 Create inventory controller
- [ ] T-179 Create inventory routes
- [ ] T-180 Create inventory list page (frontend)
- [ ] T-181 Create add/edit inventory item form
- [ ] T-182 Create low-stock alert widget on dashboard
- [ ] T-183 Add inventory API service (axios)

---

## PHASE 12 — Testing

- [ ] T-184 Set up Jest + Supertest (backend)
- [ ] T-185 Write unit tests — auth service
- [ ] T-186 Write unit tests — patient service
- [ ] T-187 Write unit tests — appointment service
- [ ] T-188 Write integration tests — auth routes
- [ ] T-189 Write integration tests — patient routes
- [ ] T-190 Write integration tests — appointment routes
- [ ] T-191 Write integration tests — billing routes
- [ ] T-192 Set up Vitest + React Testing Library (frontend)
- [ ] T-193 Write component tests — Login page
- [ ] T-194 Write component tests — Patient list
- [ ] T-195 Write component tests — Appointment form
- [ ] T-196 Configure test coverage reporting

---

## PHASE 13 — Optimization

- [ ] T-197 Add MongoDB indexes on frequently queried fields
- [ ] T-198 Implement Redis caching for dashboard stats
- [ ] T-199 Implement request rate limiting (express-rate-limit)
- [ ] T-200 Add helmet.js security headers
- [ ] T-201 Implement response compression (compression middleware)
- [ ] T-202 Add API pagination standardization
- [ ] T-203 Implement query result caching layer
- [ ] T-204 Optimize frontend bundle (code splitting, lazy loading)
- [ ] T-205 Add React Query for server-state caching (frontend)
- [ ] T-206 Audit and fix all ESLint warnings
- [ ] T-207 Implement structured API response format (ApiResponse utility)

---

## PHASE 14 — Deployment

- [ ] T-208 Create Dockerfile (backend)
- [ ] T-209 Create Dockerfile (frontend)
- [ ] T-210 Create docker-compose.yml (backend + frontend + MongoDB)
- [ ] T-211 Configure environment variables for production
- [ ] T-212 Create CI/CD pipeline (GitHub Actions — lint + test on PR)
- [ ] T-213 Create CI/CD pipeline (GitHub Actions — deploy on merge to main)
- [ ] T-214 Configure Nginx reverse proxy
- [ ] T-215 Deploy backend to Railway / Render
- [ ] T-216 Deploy frontend to Vercel / Netlify
- [ ] T-217 Configure MongoDB Atlas (production DB)
- [ ] T-218 Set up domain + SSL certificate
- [ ] T-219 Implement health monitoring (uptime checks)
- [ ] T-220 Production smoke test + final README update

---

*Total tasks: 220 | Completed: 57 | Last updated: Sprint 3 Complete*
