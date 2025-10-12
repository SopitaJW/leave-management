import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Logout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // เก็บชื่อผู้ใช้ก่อน logout
    if (user) {
      setUserName(user.firstName || user.name || 'ผู้ใช้');
    }
    
    // ทำการ logout
    logout();
  }, [logout, user]);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Icon Success with Animation */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ข้อความหลัก */}
        <h2 className="text-3xl font-bold mb-3 text-center text-gray-800">
          ออกจากระบบเรียบร้อย
        </h2>
        
        {/* ข้อความรอง */}
        <p className="text-gray-600 mb-2 text-center">
          {userName && `ขอบคุณ คุณ${userName}`}
        </p>
        <p className="text-gray-500 mb-8 text-center text-sm">
          หวังว่าจะได้พบกันใหม่เร็วๆ นี้
        </p>

        {/* ปุ่ม */}
        <div className="space-y-3">
          <button
            onClick={handleLoginRedirect}
            className="w-full bg-viridian-600 text-black py-3 rounded-lg hover:bg-viridian-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            🔐 เข้าสู่ระบบอีกครั้ง
          </button>
          
        </div>

        {/* ข้อมูลเพิ่มเติม */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            ออกจากระบบเมื่อ {new Date().toLocaleString('th-TH')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Logout;