// src/pages/employee/LeaveRequest.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LeaveRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // ข้อมูลประเภทการลา
  const leaveTypes = [
    { id: 'sick', name: 'ลาป่วย', quota: 30, color: '#ff6b6b' },
    { id: 'personal', name: 'ลากิจ', quota: 10, color: '#4ecdc4' },
    { id: 'vacation', name: 'ลาพักร้อน', quota: 10, color: '#45b7d1' },
    { id: 'maternity', name: 'ลาคลอด', quota: 90, color: '#f9ca24' }
  ];

  // State สำหรับสรุปการลา
  const [leaveSummary, setLeaveSummary] = useState([
    { type: 'sick', used: 5, remaining: 25 },
    { type: 'personal', used: 2, remaining: 8 },
    { type: 'vacation', used: 4, remaining: 6 },
    { type: 'maternity', used: 0, remaining: 90 }
  ]);

  // State สำหรับฟอร์มคำร้อง
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'sick',
    startDate: '',
    endDate: '',
    reason: '',
    contact: '',
    substitute: ''
  });

  // State สำหรับประเภทการลาที่เลือก
  const [selectedLeaveType, setSelectedLeaveType] = useState('all');

  // ข้อมูลประวัติการลา
  const [leaveHistory, setLeaveHistory] = useState([
    { id: 1, type: 'sick', startDate: '2024-01-15', endDate: '2024-01-17', days: 3, status: 'อนุมัติ' },
    { id: 2, type: 'personal', startDate: '2024-02-10', endDate: '2024-02-10', days: 1, status: 'อนุมัติ' },
    { id: 3, type: 'vacation', startDate: '2024-03-20', endDate: '2024-03-24', days: 5, status: 'รออนุมัติ' }
  ]);

  // คำนวณจำนวนวัน
  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // จัดการการเปลี่ยนแปลงในฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ส่งคำร้องการลา
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const days = calculateDays(leaveForm.startDate, leaveForm.endDate);
    
    // เพิ่มข้อมูลการลาใหม่
    const newLeave = {
      id: leaveHistory.length + 1,
      type: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      days: days,
      status: 'รออนุมัติ',
      reason: leaveForm.reason
    };
    
    setLeaveHistory([...leaveHistory, newLeave]);
    
    // อัพเดทสรุปการลา
    setLeaveSummary(prev => prev.map(item => {
      if (item.type === leaveForm.leaveType) {
        return {
          ...item,
          used: item.used + days,
          remaining: item.remaining - days
        };
      }
      return item;
    }));
    
    // รีเซ็ตฟอร์ม
    setLeaveForm({
      leaveType: 'sick',
      startDate: '',
      endDate: '',
      reason: '',
      contact: '',
      substitute: ''
    });
    
    alert('ส่งคำร้องการลาเรียบร้อยแล้ว!');
  };

  // กรองประวัติการลาตามประเภท
  const filteredHistory = selectedLeaveType === 'all' 
    ? leaveHistory 
    : leaveHistory.filter(leave => leave.type === selectedLeaveType);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="mb-8">
          <p className="text-gray-600 mt-2">จัดการคำร้องขอลาและติดตามสถานะการลาของคุณ</p>
        </header>

        {/* สรุปการลา */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 สรุปสิทธิ์การลา</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaveTypes.map(type => {
              const summary = leaveSummary.find(s => s.type === type.id);
              const percentage = (summary.used / type.quota) * 100;
              
              return (
                <div 
                  key={type.id} 
                  className="bg-white rounded-lg shadow-md p-6 border-l-4"
                  style={{ borderLeftColor: type.color }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{type.name}</h3>
                    <span className="text-xl font-bold" style={{ color: type.color }}>
                      {summary.remaining}/{type.quota}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div 
                      className="h-2.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: type.color 
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>ใช้ไป: {summary.used} วัน</span>
                    <span>คงเหลือ: {summary.remaining} วัน</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ฟอร์มคำร้องการลา */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">✍️ ยื่นคำร้องการลา</h2>
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              

              {/* วันที่เริ่มลา */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วันที่เริ่มลา *
                </label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={leaveForm.startDate} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                  required
                />
              </div>

              {/* วันที่สิ้นสุด */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วันที่สิ้นสุด *
                </label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={leaveForm.endDate} 
                  onChange={handleInputChange}
                  min={leaveForm.startDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                  required
                />
              </div>

               {/* ประเภทการลา */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ประเภทการลา *
                </label>
                <select 
                  name="leaveType" 
                  value={leaveForm.leaveType} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                  required
                >
                  {leaveTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              {/* จำนวนวัน */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  จำนวนวัน
                </label>
                <input 
                  type="text" 
                  value={calculateDays(leaveForm.startDate, leaveForm.endDate) + ' วัน'} 
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                />
              </div>

              {/* เหตุผลการลา */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เหตุผลการลา *
                </label>
                <textarea 
                  name="reason" 
                  value={leaveForm.reason} 
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="กรุณาระบุเหตุผลการลา..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                  required
                />
              </div>

              {/* เบอร์ติดต่อ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เบอร์ติดต่อระหว่างลา
                </label>
                <input 
                  type="tel" 
                  name="contact" 
                  value={leaveForm.contact} 
                  onChange={handleInputChange}
                  placeholder="08X-XXX-XXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                />
              </div>

              {/* ผู้รับมอบหมายงาน */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ผู้รับมอบหมายงาน
                </label>
                <input 
                  type="text" 
                  name="substitute" 
                  value={leaveForm.substitute} 
                  onChange={handleInputChange}
                  placeholder="ชื่อผู้รับมอบหมายงาน"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* ปุ่มส่ง */}
            <div className="mt-6">
              <button 
                type="submit" 
                className="w-full bg-sky-400 text-black py-3 px-6 rounded-lg font-medium hover:bg-viridian-700 transition-colors shadow-md"
              >
                📤 ส่งคำร้องการลา
              </button>
            </div>
          </form>
        </section>

        {/* ตารางประวัติการลา */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">📜 ประวัติการลา</h2>
            
            {/* Filter */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">กรองตามประเภท:</label>
              <select 
                value={selectedLeaveType} 
                onChange={(e) => setSelectedLeaveType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
              >
                <option value="all">ทั้งหมด</option>
                {leaveTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่เริ่ม</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สิ้นสุด</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนวัน</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHistory.map((leave, index) => {
                    const leaveType = leaveTypes.find(t => t.id === leave.type);
                    return (
                      <tr key={leave.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className="px-3 py-1 text-xs font-medium rounded-full text-white"
                            style={{ backgroundColor: leaveType?.color }}
                          >
                            {leaveType?.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(leave.startDate).toLocaleDateString('th-TH')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(leave.endDate).toLocaleDateString('th-TH')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.days} วัน</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            leave.status === 'อนุมัติ' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-8">
          <Link 
            to="/employee/dashboard" 
            className="inline-flex items-center text-viridian-600 hover:text-viridian-700 font-medium"
          >
            ← กลับไปหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;