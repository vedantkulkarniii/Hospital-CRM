import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Enter a valid email address.'); return; }

    const result = await forgotPassword(email);
    if (result.success) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 shadow-lg mb-4">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
          <p className="text-sm text-gray-500 mt-1">We&apos;ll send you a reset link</p>
        </div>

        <div className="card shadow-lg border border-gray-100">
          {submitted ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Check your email</h2>
              <p className="text-sm text-gray-500 mb-6">
                If an account exists for <strong>{email}</strong>, you&apos;ll receive a password reset link shortly.
              </p>
              <Link to="/login" className="btn-primary">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="doctor@hospital.com"
                  className={`form-input ${error ? 'border-red-400' : ''}`}
                  aria-invalid={!!error}
                />
                {error && <p className="mt-1 text-xs text-red-600" role="alert">{error}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full py-2.5 font-semibold">
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : 'Send reset link'}
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mt-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
