import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { selectIsAuthenticated } from './store/slices/authSlice.js';

// ─── Layout Components ────────────────────────────────────────────────────────
import DashboardLayout from './layouts/DashboardLayout.jsx';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('./pages/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage.jsx'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage.jsx'));

// ─── Loading fallback ─────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" aria-label="Loading page" />
    </div>
  );
}

// ─── Placeholder for pages not yet built ─────────────────────────────────────
function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-500 text-sm">Coming in a future sprint.</p>
      </div>
    </div>
  );
}

// ─── Route Guards ─────────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ── Public / Auth Routes ── */}
        <Route
          path="/login"
          element={<PublicRoute><LoginPage /></PublicRoute>}
        />
        <Route
          path="/register"
          element={<PublicRoute><RegisterPage /></PublicRoute>}
        />
        <Route
          path="/forgot-password"
          element={<PublicRoute><ForgotPasswordPage /></PublicRoute>}
        />

        {/* ── Protected Routes with Layout ── */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
        >
          <Route index element={<DashboardPage />} />
          <Route path="patients/*" element={<PlaceholderPage title="Patients" />} />
          <Route path="doctors/*" element={<PlaceholderPage title="Doctors" />} />
          <Route path="appointments/*" element={<PlaceholderPage title="Appointments" />} />
          <Route path="billing/*" element={<PlaceholderPage title="Billing" />} />
          <Route path="prescriptions/*" element={<PlaceholderPage title="Prescriptions" />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
        </Route>

        {/* ── Default ── */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<PlaceholderPage title="404 — Page Not Found" />} />

      </Routes>
    </Suspense>
  );
}
