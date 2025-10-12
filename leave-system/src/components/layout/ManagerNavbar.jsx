// src/components/layout/ManagerNavbar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon,
  ClipboardListIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserIcon, 
  LogoutIcon,
  ChevronDownIcon
} from '@heroicons/react/outline';

const ManagerNavbar = () => {
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
            <NavLink to="/manager/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-viridian-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-xl font-bold">LA</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-viridian-600 group-hover:text-viridian-700 transition-colors hidden sm:block">
                ระบบจัดการการลา
              </span>
              <span className="text-lg font-bold text-viridian-600 group-hover:text-viridian-700 transition-colors sm:hidden">
                ระบบลา
              </span>
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="flex items-center space-x-2">
            
            {/* หน้าแรก */}
            <NavLink
              to="/manager/dashboard"
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

            {/* อนุมัติการลา */}
            <NavLink
              to="/manager/approve-leave"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-viridian-100 text-viridian-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-viridian-600'
                }`
              }
            >
              <CheckCircleIcon className="h-5 w-5" />
              <span>อนุมัติการลา</span>
            </NavLink>

          

            {/* User Profile Dropdown */}
            <div className="relative ml-4 pl-4 border-l border-gray-200">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'M'}
                  </span>
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.firstName || user?.name || 'ผู้จัดการ'}
                  </p>
                  <p className="text-xs text-gray-500">หัวหน้า</p>
                </div>
                <ChevronDownIcon className={`h-4 w-4 text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          👔 หัวหน้า
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {user?.department || 'ไม่ระบุแผนก'}
                        </span>
                      </div>
                    </div>

                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                      การลาของฉัน
                    </div>
                    
                    <NavLink
                      to="/manager/leave-request"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <ClipboardListIcon className="h-5 w-5" />
                      <span>ยื่นใบลา</span>
                    </NavLink>

                    <NavLink
                      to="/manager/leave-history"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <ClipboardListIcon className="h-5 w-5" />
                      <span>ประวัติการลาของฉัน</span>
                    </NavLink>

                    <div className="border-t border-gray-200 my-2"></div>

                    <NavLink
                      to="/manager/profilem"
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

export default ManagerNavbar;
