# Hospital CRM — Sprint History

---

## Sprint 1 ✅ COMPLETE

| Field | Value |
|---|---|
| Date | Day 1 |
| Phase | Phase 1 — Project Setup |
| Starting Task | T-001 |
| Ending Task | T-030 |
| Commits | 10 |
| Status | ✅ Complete |

### Commits
1. `docs: initialize project tracking files and 220-task roadmap`
2. `chore: add root .gitignore for node, env, build, and OS files`
3. `feat: initialize Node.js backend with package.json and all dependencies`
4. `chore: configure ESLint, Prettier, and backend folder structure`
5. `feat: add .env.example, MongoDB connection utility, and Winston logger`
6. `feat: create Express app with CORS, helmet, rate-limiting, morgan, and error handlers`
7. `feat: create server.js with graceful shutdown and ApiResponse utility`
8. `feat: initialize React frontend with Vite, Tailwind CSS, Redux, and folder structure`
9. `feat: configure React Router, Redux store, auth slice, and app entry point`
10. `docs: update sprint 1 progress, roadmap, and add axios API client with token refresh interceptor`

---

## Sprint 2 ✅ COMPLETE

| Field | Value |
|---|---|
| Date | Day 2 |
| Phase | Phase 2 — Authentication |
| Starting Task | T-031 |
| Ending Task | T-055 |
| Commits | 10 |
| Status | ✅ Complete |

### Tasks Completed
- T-031 User schema with roles enum
- T-032–T-033 Role enum + bcrypt pre-save hook
- T-034–T-036 Auth service (register, login, refresh)
- T-037 JWT utility
- T-038–T-042 Auth controller + routes
- T-043–T-044 Authenticate + Authorize middleware
- T-045 express-validator input validation
- T-046 Refresh token rotation + reuse detection
- T-048–T-050 Login, Register, ForgotPassword pages + route guards
- T-051–T-053 Axios auth service + interceptor + logout
- T-054–T-055 Forgot/reset password routes

### Commits
1. `feat: create User schema with roles, bcrypt pre-save hook, and instance methods`
2. `feat: create JWT utility with sign/verify for access and refresh tokens`
3. `feat: implement auth service with register, login, refresh token rotation, logout, and password reset`
4. `feat: add authenticate, authorize (RBAC), validate middleware, and auth input validators`
5. `feat: create auth controller and routes (register, login, logout, refresh, forgot/reset-password)`
6. `feat: add frontend auth service and useAuth hook with login, register, logout, and password reset`
7. `feat: build Login page UI with form validation, password toggle, and accessible markup`
8. `feat: build Register page UI with role selection, password strength checker, and validation`
9. `feat: add ForgotPassword page, wire auth pages into App with lazy loading and route guards`
10. `docs: update sprint 2 progress, roadmap completion, and sprint history`

---

## Sprint 3 ✅ COMPLETE

| Field | Value |
|---|---|
| Date | Day 3 |
| Phase | Phase 3 — Dashboard + Phase 4 start |
| Starting Task | T-056 |
| Ending Task | T-068 |
| Commits | 11 |
| Status | ✅ Complete |

### Tasks Completed
- T-056 Dashboard layout component (sidebar + topbar)
- T-057 Responsive sidebar with all navigation links
- T-058 Topbar with user info, role badge + logout
- T-059 Stats card component
- T-060 GET /api/dashboard/stats route
- T-061 Dashboard service (aggregate counts: patients, doctors, appointments)
- T-062 Recent appointments widget (UI)
- T-063 Recent patients widget (UI)
- T-064 Area chart — appointments trend (Recharts)
- T-065 Pie chart — appointment status breakdown (Recharts)
- T-066 Role-based dashboard views
- T-067 Loading skeletons for dashboard cards
- T-068 Patient schema (Mongoose) — full sub-schemas, soft delete, text search, patientId

### Commits
1. `feat: create dashboard layout component with sidebar and topbar`
2. `feat: create dashboard stats API endpoint and route`
3. `feat: add dashboard service and module pages with routing`
4. `feat: create chart components (area chart and pie chart) for dashboard`
5. `feat: add dashboard state management, skeleton loaders, and hooks`
6. `fix: downgrade to Tailwind CSS v3 for stable styling`
7. `feat: integrate dashboard stats API with loading and error states`
8. `feat: add dashboard footer, empty state component, and improve module pages UX`
9. `feat: create reusable UI components (Modal, Alert, Table, LoadingSpinner)`
10. `feat: create Patient schema with medical history, soft delete, text search indexes, and auto patientId`
11. `docs: update sprint 3 progress, roadmap, and sprint history`

---

## Sprint 4 (Upcoming)

- Starting Task: T-069 Create patient service — createPatient
- Phase: Phase 4 — Patient Management (continue)
- Goal: Complete full patient CRUD backend + frontend (services, controller, routes, list page, forms, detail page)

---

*Next sprint begins on: BEGIN command*
