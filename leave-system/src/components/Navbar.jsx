import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingCartIcon, SearchIcon, UserIcon, MenuIcon, XIcon } from '@heroicons/react/outline';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // เช็คว่าอยู่ในหน้า leave หรือไม่
  const isLeaveActive = location.pathname.includes('/leave') || location.pathname === '/about';

 return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 bg-viridian-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold text-viridian-600 group-hover:text-viridian-700 transition-colors">
              Time Attendance
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-gray-700 hover:text-viridian-600 transition-colors font-medium ${
                  isActive ? 'text-viridian-600 border-b-2 border-viridian-600' : ''
                }`
              }
            >
              หน้าแรก
            </NavLink>

            {/* Dropdown ระบบลา */}
            <div className="relative group">
              <button className={`text-gray-700 hover:text-viridian-600 transition-colors font-medium flex items-center gap-1 ${
                isLeaveActive ? 'text-viridian-600 border-b-2 border-viridian-600' : ''
              }`}>
                ระบบลา
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <NavLink
                  to="/leave-history"
                  className={({ isActive }) =>
                    `block px-4 py-3 text-sm text-gray-700 hover:bg-viridian-50 hover:text-viridian-600 transition-colors ${
                      isActive ? 'bg-viridian-100 text-viridian-700 font-semibold border-l-4 border-viridian-600' : ''
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <span>📋</span>
                    <span>ประวัติการลา</span>
                  </div>
                </NavLink>
                
                <NavLink
                  to="/leave-request"
                  className={({ isActive }) =>
                    `block px-4 py-3 text-sm text-gray-700 hover:bg-viridian-50 hover:text-viridian-600 transition-colors ${
                      isActive ? 'bg-viridian-100 text-viridian-700 font-semibold border-l-4 border-viridian-600' : ''
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <span>✍️</span>
                    <span>บันทึกการลา</span>
                  </div>
                </NavLink>

                <div className="border-t border-gray-200 my-2"></div>

                <NavLink
                  to="/manager-leave"
                  className={({ isActive }) =>
                    `block px-4 py-3 text-sm text-gray-700 hover:bg-viridian-50 hover:text-viridian-600 transition-colors ${
                      isActive ? 'bg-viridian-100 text-viridian-700 font-semibold border-l-4 border-viridian-600' : ''
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <span>👔</span>
                    <span>อนุมัติการลา (หัวหน้า)</span>
                  </div>
                </NavLink>
              </div>
            </div>
            
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-viridian-600 transition-colors">
              <SearchIcon className="h-6 w-6" />
            </button>
            
            <button className="relative p-2 text-gray-600 hover:text-viridian-600 transition-colors">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
                  rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button className="p-2 text-gray-600 hover:text-viridian-600 transition-colors">
              <UserIcon className="h-6 w-6" />
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;