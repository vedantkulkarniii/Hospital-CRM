import { Menu, LogOut, User, Bell } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Topbar({ onMenuClick }) {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  const handleLogout = async () => {
    await authLogout();
  };

  const userFullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.email || 'User';

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      {/* Left Section - Menu Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition md:hidden"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      </div>

      {/* Right Section - Notifications, User Menu */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
          <Bell size={24} className="text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu Dropdown */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          {/* Avatar */}
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
          </div>

          {/* User Info */}
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{userFullName}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>

          {/* Dropdown Menu - Simple Logout Button */}
          <div className="relative group">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <User size={20} className="text-gray-700" />
            </button>

            {/* Dropdown Content */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{userFullName}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
