import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './store/slices/authSlice.js';

// Lazy imports will be added as pages are built
// For now, placeholder pages are used

function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-500 text-sm">This page is under construction.</p>
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Public route (redirects to dashboard if already authenticated)
function PublicRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <PlaceholderPage title="Login" />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <PlaceholderPage title="Register" />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Patients" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctors"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Doctors" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Appointments" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Billing" />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<PlaceholderPage title="404 — Page Not Found" />} />
    </Routes>
  );
}
