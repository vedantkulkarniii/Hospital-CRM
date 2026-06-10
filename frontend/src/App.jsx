import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { selectIsAuthenticated } from './store/slices/authSlice.js';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('./pages/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage.jsx'));

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

        {/* ── Protected Routes ── */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><PlaceholderPage title="Dashboard" /></ProtectedRoute>}
        />
        <Route
          path="/patients/*"
          element={<ProtectedRoute><PlaceholderPage title="Patients" /></ProtectedRoute>}
        />
        <Route
          path="/doctors/*"
          element={<ProtectedRoute><PlaceholderPage title="Doctors" /></ProtectedRoute>}
        />
        <Route
          path="/appointments/*"
          element={<ProtectedRoute><PlaceholderPage title="Appointments" /></ProtectedRoute>}
        />
        <Route
          path="/billing/*"
          element={<ProtectedRoute><PlaceholderPage title="Billing" /></ProtectedRoute>}
        />
        <Route
          path="/reports"
          element={<ProtectedRoute><PlaceholderPage title="Reports" /></ProtectedRoute>}
        />
        <Route
          path="/inventory"
          element={<ProtectedRoute><PlaceholderPage title="Inventory" /></ProtectedRoute>}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute><PlaceholderPage title="Settings" /></ProtectedRoute>}
        />

        {/* ── Default ── */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<PlaceholderPage title="404 — Page Not Found" />} />

      </Routes>
    </Suspense>
  );
}
