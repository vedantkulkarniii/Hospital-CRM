import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Users, Calendar, FileText, BarChart3, Settings } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const user = useSelector(selectCurrentUser);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'doctor', 'receptionist'] },
    { label: 'Patients', icon: Users, path: '/dashboard/patients', roles: ['admin', 'doctor', 'receptionist'] },
    { label: 'Doctors', icon: Users, path: '/dashboard/doctors', roles: ['admin', 'receptionist'] },
    { label: 'Appointments', icon: Calendar, path: '/dashboard/appointments', roles: ['admin', 'doctor', 'receptionist'] },
    { label: 'Prescriptions', icon: FileText, path: '/dashboard/prescriptions', roles: ['doctor', 'admin'] },
    { label: 'Billing', icon: BarChart3, path: '/dashboard/billing', roles: ['admin', 'receptionist'] },
    { label: 'Reports', icon: BarChart3, path: '/dashboard/reports', roles: ['admin'] },
    { label: 'Settings', icon: Settings, path: '/dashboard/settings', roles: ['admin', 'doctor', 'receptionist', 'patient'] },
  ];

  // Filter nav items based on user role
  const userRole = user?.role || 'patient';
  const filteredItems = navItems.filter(item => item.roles.includes(userRole));

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="md:hidden p-4 bg-white border-b border-gray-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'w-64' : 'w-0'
        } md:w-64 bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">HCR</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Hospital CRM</h1>
              <p className="text-xs text-gray-500">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">Hospital CRM v1.0</p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
