import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import './AboutPage.css';

const LeaveRequestPage = () => {
  const navigate = useNavigate();
  
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

  // State สำหรับประเภทการลาที่เลือก (สำหรับตาราง)
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
    <div className="leave-request-container">
      <header className="leave-header">
        <h1>📋 ระบบการลา</h1>
        <p>จัดการคำร้องขอลาและติดตามสถานะการลาของคุณ</p>
      </header>

      {/* สรุปการลา */}
      <section className="leave-summary-section">
        <h2>📊 สรุปสิทธิ์การลา</h2>
        <div className="leave-cards">
          {leaveTypes.map(type => {
            const summary = leaveSummary.find(s => s.type === type.id);
            const percentage = (summary.used / type.quota) * 100;
            
            return (
              <div key={type.id} className="leave-card" style={{ borderLeft: `4px solid ${type.color}` }}>
                <div className="leave-card-header">
                  <h3>{type.name}</h3>
                  <span className="leave-quota">{summary.remaining}/{type.quota} วัน</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${percentage}%`, backgroundColor: type.color }}
                  ></div>
                </div>
                <div className="leave-stats">
                  <span>ใช้ไป: {summary.used} วัน</span>
                  <span>คงเหลือ: {summary.remaining} วัน</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ฟอร์มคำร้องการลา */}
      <section className="leave-form-section">
        <h2>✍️ ยื่นคำร้องการลา</h2>
        <form onSubmit={handleSubmit} className="leave-form">
          <div className="form-grid">
            <div className="form-group">
              <label>ประเภทการลา *</label>
              <select 
                name="leaveType" 
                value={leaveForm.leaveType} 
                onChange={handleInputChange}
                required
              >
                {leaveTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>วันที่เริ่มลา *</label>
              <input 
                type="date" 
                name="startDate" 
                value={leaveForm.startDate} 
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>วันที่สิ้นสุด *</label>
              <input 
                type="date" 
                name="endDate" 
                value={leaveForm.endDate} 
                onChange={handleInputChange}
                min={leaveForm.startDate}
                required
              />
            </div>

            <div className="form-group">
              <label>จำนวนวัน</label>
              <input 
                type="text" 
                value={calculateDays(leaveForm.startDate, leaveForm.endDate) + ' วัน'} 
                disabled
                className="days-display"
              />
            </div>

            <div className="form-group full-width">
              <label>เหตุผลการลา *</label>
              <textarea 
                name="reason" 
                value={leaveForm.reason} 
                onChange={handleInputChange}
                rows="3"
                placeholder="กรุณาระบุเหตุผลการลา..."
                required
              />
            </div>

            <div className="form-group">
              <label>เบอร์ติดต่อระหว่างลา</label>
              <input 
                type="tel" 
                name="contact" 
                value={leaveForm.contact} 
                onChange={handleInputChange}
                placeholder="08X-XXX-XXXX"
              />
            </div>

            <div className="form-group">
              <label>ผู้รับมอบหมายงาน</label>
              <input 
                type="text" 
                name="substitute" 
                value={leaveForm.substitute} 
                onChange={handleInputChange}
                placeholder="ชื่อผู้รับมอบหมายงาน"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            📤 ส่งคำร้องการลา
          </button>
        </form>
      </section>

      {/* ตารางประวัติการลา */}
      <section className="leave-history-section">
        <div className="history-header">
          <h2>📜 ประวัติการลา</h2>
          <div className="filter-group">
            <label>กรองตามประเภท:</label>
            <select 
              value={selectedLeaveType} 
              onChange={(e) => setSelectedLeaveType(e.target.value)}
              className="filter-select"
            >
              <option value="all">ทั้งหมด</option>
              {leaveTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="leave-table">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>ประเภท</th>
                <th>วันที่เริ่ม</th>
                <th>วันที่สิ้นสุด</th>
                <th>จำนวนวัน</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((leave, index) => {
                const leaveType = leaveTypes.find(t => t.id === leave.type);
                return (
                  <tr key={leave.id}>
                    <td>{index + 1}</td>
                    <td>
                      <span 
                        className="leave-badge" 
                        style={{ backgroundColor: leaveType?.color }}
                      >
                        {leaveType?.name}
                      </span>
                    </td>
                    <td>{new Date(leave.startDate).toLocaleDateString('th-TH')}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString('th-TH')}</td>
                    <td>{leave.days} วัน</td>
                    <td>
                      <span className={`status-badge ${leave.status === 'อนุมัติ' ? 'approved' : 'pending'}`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <Link to="/books" className="back-link">← กลับไปหน้ารายการหนังสือ</Link>
    </div>
  );
};

export default LeaveRequestPage;