// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // ตัวอย่าง: จำลองการ login
    // ในโปรเจกต์จริงควรเรียก API
    
    if (username === 'employee' && password === '1234') {
      const userData = {
        id: 1,
        name: 'สมชาย ใจดี',
        email: 'somchai@example.com',
        role: 'employee',
        department: 'IT'
      };
      login(userData);
      navigate('/employee/dashboard');
      
    } else if (username === 'manager' && password === '1234') {
      const userData = {
        id: 2,
        name: 'สมหญิง รักงาน',
        email: 'somying@example.com',
        role: 'manager',
        department: 'IT'
      };
      login(userData);
      navigate('/manager/dashboard');
      
    } else {
      alert('Username หรือ Password ไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">เข้าสู่ระบบ</h2>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-viridian-600"
              placeholder="employee หรือ manager"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-viridian-600"
              placeholder="1234"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-viridian-600 text-white py-2 rounded-lg hover:bg-viridian-700 transition-colors"
          >
            เข้าสู่ระบบ
          </button>
        </form>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>ทดสอบ:</p>
          <p>- พนักงาน: employee / 1234</p>
          <p>- หัวหน้า: manager / 1234</p>
        </div>
      </div>
    </div>
  );
};

export default Login;