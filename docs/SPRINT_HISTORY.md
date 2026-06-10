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
- T-032 Role enum (admin, doctor, receptionist, patient)
- T-033 bcrypt pre-save hook
- T-034 Auth service — register
- T-035 Auth service — login
- T-036 Auth service — token refresh
- T-037 JWT utility (sign + verify access + refresh tokens)
- T-038 Auth controller (7 endpoints)
- T-039–T-042 Auth routes (register, login, logout, refresh)
- T-043 Authenticate middleware
- T-044 Authorize (RBAC) middleware
- T-045 express-validator input validation
- T-046 Refresh token rotation + reuse detection
- T-048 Login page (React) with accessible form
- T-049 Register page with password strength checker
- T-050 Protected + Public route guards
- T-051 Auth service (axios)
- T-052 Token auto-refresh interceptor
- T-053 Logout + cookie clear
- T-054 Forgot password route
- T-055 Reset password route
- ForgotPasswordPage UI (bonus)

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

## Sprint 3 (Upcoming)

- Starting Task: T-056 Create dashboard layout component
- Phase: Phase 3 — Dashboard + Phase 4 — Patient Management (start)
- Goal: Build sidebar layout, dashboard stats API, and begin patient module

---

*Next sprint begins on: BEGIN command*
