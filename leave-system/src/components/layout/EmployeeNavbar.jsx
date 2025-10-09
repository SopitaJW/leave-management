// src/components/layout/EmployeeNavbar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon,
  ClipboardListIcon, 
  DocumentTextIcon,
  UserIcon, 
  LogoutIcon,
  MenuIcon,
  XIcon
} from '@heroicons/react/outline';

const EmployeeNavbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-viridian-600">
              📋 ระบบลา
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-1">
             <NavLink
              to="/employee/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gray-200 text-black shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <ClipboardListIcon className="h-5 w-5" />
              หน้าแรก
            </NavLink>

            <NavLink
              to="/employee/leave-history"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gray-200 text-black shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <ClipboardListIcon className="h-5 w-5" />
              ประวัติการลา
            </NavLink>

            <NavLink
              to="/employee/leave-request"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gray-200 text-black shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <DocumentTextIcon className="h-5 w-5" />
              บันทึกการลา
            </NavLink>

            {/* User Section */}
            <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-200">
              <NavLink
                to="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-viridian-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-viridian-100 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-viridian-600" />
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </NavLink>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogoutIcon className="h-5 w-5" />
                ออกจากระบบ
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <NavLink
              to="/employee/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-viridian-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <HomeIcon className="h-5 w-5" />
              หน้าแรก
            </NavLink>

            <NavLink
              to="/employee/leave-history"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-viridian-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <ClipboardListIcon className="h-5 w-5" />
              ประวัติการลา
            </NavLink>

            <NavLink
              to="/employee/leave-request"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-viridian-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <DocumentTextIcon className="h-5 w-5" />
              บันทึกการลา
            </NavLink>

            <div className="border-t border-gray-200 my-2"></div>

            <NavLink
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <UserIcon className="h-5 w-5" />
              {user?.name}
            </NavLink>

            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
            >
              <LogoutIcon className="h-5 w-5" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default EmployeeNavbar;