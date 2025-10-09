// src/components/layout/ManagerNavbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ManagerNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="text-xl font-bold">👔 หัวหน้า: {user?.name}</div>
          
          <div className="flex space-x-6">
            <NavLink to="/manager/dashboard" className="nav-link">
              หน้าแรก
            </NavLink>
            
            {/* Dropdown ระบบลา */}
            <div className="relative group">
              <button className="nav-link flex items-center gap-1">
                ระบบลา
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="dropdown-menu">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500">พนักงาน</div>
                <NavLink to="/manager/leave-history" className="dropdown-item">
                  📋 ประวัติการลาของฉัน
                </NavLink>
                <NavLink to="/manager/leave-request" className="dropdown-item">
                  ✍️ บันทึกการลา
                </NavLink>
                
                <div className="border-t my-2"></div>
                
                <div className="px-4 py-2 text-xs font-semibold text-gray-500">หัวหน้างาน</div>
                <NavLink to="/manager/approve-leave" className="dropdown-item">
                  ✅ อนุมัติการลา
                </NavLink>
                <NavLink to="/manager/team-leave" className="dropdown-item">
                  👥 ประวัติการลาทีม
                </NavLink>
                <NavLink to="/manager/team-calendar" className="dropdown-item">
                  📅 ปฏิทินทีม
                </NavLink>
              </div>
            </div>

            <NavLink to="/manager/team" className="nav-link">
              ทีมงาน
            </NavLink>
            
            <NavLink to="/profile" className="nav-link">
              โปรไฟล์
            </NavLink>
            
            <button onClick={logout} className="text-red-600 hover:text-red-700">
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ManagerNavbar;