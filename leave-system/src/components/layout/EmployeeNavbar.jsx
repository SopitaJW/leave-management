// src/components/layout/EmployeeNavbar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon,
  ClipboardListIcon, 
  DocumentTextIcon,
  UserIcon, 
  LogoutIcon,
  ChevronDownIcon
} from '@heroicons/react/outline';

const EmployeeNavbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center">
            <NavLink to="/employee/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-viridian-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-xl font-bold">LA</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-viridian-600 group-hover:text-viridian-700 transition-colors hidden sm:block">
                ระบบการลา
              </span>
              <span className="text-lg font-bold text-viridian-600 group-hover:text-viridian-700 transition-colors sm:hidden">
                ระบบลา
              </span>
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="flex items-center space-x-2">
            
            <NavLink
              to="/employee/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-viridian-100 text-viridian-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-viridian-600'
                }`
              }
            >
              <HomeIcon className="h-5 w-5" />
              <span>หน้าแรก</span>
            </NavLink>

            <NavLink
              to="/employee/leave-request"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-viridian-100 text-viridian-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-viridian-600'
                }`
              }
            >
              <DocumentTextIcon className="h-5 w-5" />
              <span>ยื่นใบลา</span>
            </NavLink>

            <NavLink
              to="/employee/leave-history"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-viridian-100 text-viridian-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-viridian-600'
                }`
              }
            >
              <ClipboardListIcon className="h-5 w-5" />
              <span>ประวัติการลา</span>
            </NavLink>

            {/* User Profile Dropdown */}
            <div className="relative ml-4 pl-4 border-l border-gray-200">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                {/* Profile Avatar */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-600 overflow-hidden">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-semibold">
                      {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'ผ'}
                    </span>
                  )}
                </div>

                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.firstName || user?.name || 'ผู้ใช้'}
                  </p>
                  <p className="text-xs text-gray-500">พนักงาน</p>
                </div>

                <ChevronDownIcon
                  className={`h-4 w-4 text-gray-600 transition-transform ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileOpen(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                    
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {user?.department || 'ไม่ระบุแผนก'}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          {user?.position || 'ไม่ระบุตำแหน่ง'}
                        </span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <NavLink
                      to="/employee/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>ข้อมูลส่วนตัว</span>
                    </NavLink>

                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogoutIcon className="h-5 w-5" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EmployeeNavbar;
