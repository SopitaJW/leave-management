// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// ✅ ถ้าเชื่อมต่อ API จริง จะต้อง import axios หรือ library ที่ใช้เรียก API ด้วย
// import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // ==============================
    // 🔌 [1] ตรงนี้ต้องแก้เมื่อเชื่อม API จริง
    // ==============================
    // ปัจจุบันเป็นการจำลอง (mock login)
    // ในระบบจริงควรเรียก API เช่น:
    //
    // try {
    //   const response = await axios.post('/api/auth/login', { username, password });
    //   const userData = response.data; // ดึงข้อมูล user จาก API
    //   login(userData);
    //
    //   // นำทางตาม role ที่ backend ส่งกลับมา
    //   if (userData.role === 'employee') navigate('/employee/dashboard');
    //   else if (userData.role === 'manager') navigate('/manager/dashboard');
    //   else navigate('/');
    // } catch (error) {
    //   alert('เข้าสู่ระบบไม่สำเร็จ');
    // }

    // ------------------------------
    // Mock login (ลบออกเมื่อใช้ API จริง)
    // ------------------------------
    if (username === 'employee' && password === '1234') {
      // ✅ [2] userData mock — ในระบบจริงจะได้จาก response.data
      const userData = {
        id: 1,
        name: 'สุวพิชญ์ อาษา',
        email: 'Suwapich@silpakorn.edu',
        role: 'employee',
        department: 'IT'
      };
      login(userData); // ✅ [3] ส่งข้อมูล user เข้า context (ยังใช้ได้เหมือนเดิม)
      navigate('/employee/dashboard'); // ✅ [4] อาจเปลี่ยนให้ navigate ตาม role ที่ API ส่งมา

    } else if (username === 'manager' && password === '1234') {
      const userData = {
        id: 2,
        name: 'โสภิตา เจ็งศรีวงศ์',
        email: 'sopita@silpakorn.edu',
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white/80 backdrop-blur-md border border-gray-200 p-8 rounded-2xl shadow-md w-96 transition-all hover:shadow-lg">
        
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-10 mx-auto mb-4 bg-viridian-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold tracking-wide">
            LA
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">เข้าสู่ระบบ</h2>
          <p className="text-sm text-gray-500 mt-1">ระบบจัดการการลา</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
              placeholder="กรอกชื่อผู้ใช้"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
              placeholder="กรอกรหัสผ่าน"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-viridian-600 text-white py-2.5 rounded-lg font-medium hover:bg-viridian-700 active:scale-[0.98] transition-all"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* Hint (optional) */}
        {/* <div className="mt-6 text-xs text-gray-400 text-center">
          <p>พนักงาน: <span className="font-medium text-gray-500">employee / 1234</span></p>
          <p>หัวหน้า: <span className="font-medium text-gray-500">manager / 1234</span></p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
