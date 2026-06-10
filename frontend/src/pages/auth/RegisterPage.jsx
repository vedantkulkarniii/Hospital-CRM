import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Stethoscope, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';

const ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'patient', label: 'Patient' },
];

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
];

export default function RegisterPage() {
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'receptionist',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    else if (formData.firstName.trim().length < 2) errs.firstName = 'Min 2 characters.';

    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    else if (formData.lastName.trim().length < 2) errs.lastName = 'Min 2 characters.';

    if (!formData.email) errs.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Enter a valid email.';

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (!PASSWORD_RULES.every((r) => r.test(formData.password))) {
      errs.password = 'Password does not meet requirements.';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await register(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 shadow-lg mb-4">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="text-sm text-gray-500 mt-1">Join Hospital CRM today</p>
        </div>

        {/* Card */}
        <div className="card shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="form-label">First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={`form-input ${errors.firstName ? 'border-red-400' : ''}`}
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600" role="alert">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="form-label">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={`form-input ${errors.lastName ? 'border-red-400' : ''}`}
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600" role="alert">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@hospital.com"
                className={`form-input ${errors.email ? 'border-red-400' : ''}`}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600" role="alert">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="form-label">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input bg-white"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Phone (optional) */}
            <div>
              <label htmlFor="phone" className="form-label">
                Phone <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555 000 0000"
                className="form-input"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`form-input pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength checklist */}
              {formData.password && (
                <ul className="mt-2 space-y-1">
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(formData.password);
                    return (
                      <li key={rule.label} className={`text-xs flex items-center gap-1.5 ${passed ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${passed ? 'bg-green-500' : 'bg-gray-300'}`} />
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              )}
              {errors.password && (
                <p className="mt-1 text-xs text-red-600" role="alert">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-2.5 text-sm font-semibold mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Hospital CRM. All rights reserved.
        </p>
      </div>
    </div>
  );
}
