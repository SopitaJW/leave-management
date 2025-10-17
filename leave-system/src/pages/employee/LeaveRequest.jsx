import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
// สมมติว่าเราได้ EmployeeID ของคนที่ login เข้ามาแล้ว
const CURRENT_EMPLOYEE_ID = 1004;

// สีสำหรับประเภทการลา
const leaveTypeColors = {
  'ลาป่วย': '#ff6b6b',
  'ลากิจ': '#4ecdc4',
  'ลาพักร้อน': '#45b7d1',
  'ลาคลอด': '#f9ca24',
};

const LeaveRequest = () => {
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    leaveTypeId: '',
  });

  const [selectedLeaveTypeFilter, setSelectedLeaveTypeFilter] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const summaryRes = await axios.get(`${API_URL}/summary/${CURRENT_EMPLOYEE_ID}`);
      setLeaveSummary(summaryRes.data.data);
      if (summaryRes.data.data.length > 0) {
        setLeaveForm(prev => ({ ...prev, leaveTypeId: summaryRes.data.data[0].id }));
      }

      const historyRes = await axios.get(`${API_URL}/history/${CURRENT_EMPLOYEE_ID}`);
      setLeaveHistory(historyRes.data.data);

    } catch (error) {
      console.error("Error fetching data:", error);
      alert('ไม่สามารถดึงข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate < startDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLeaveForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason || !leaveForm.leaveTypeId) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const days = calculateDays(leaveForm.startDate, leaveForm.endDate);
    if (days <= 0) {
        alert("วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น และต้องลาอย่างน้อย 1 วัน");
        return;
    }

    // --- LOGIC การตรวจสอบสิทธิ์คงเหลือ ---
    const selectedLeaveSummary = leaveSummary.find(
      summary => summary.id === parseInt(leaveForm.leaveTypeId)
    );

    if (selectedLeaveSummary && days > selectedLeaveSummary.remaining) {
      alert(
        `ยื่นคำร้องไม่สำเร็จ!\n\nคุณขอลา ${days} วัน แต่มีสิทธิ์การลาประเภทนี้เหลือเพียง ${selectedLeaveSummary.remaining} วัน`
      );
      return; // หยุดการทำงาน
    }
    // --- สิ้นสุด LOGIC การตรวจสอบ ---

    const newRequest = {
      ...leaveForm,
      employeeId: CURRENT_EMPLOYEE_ID,
    };

    try {
      await axios.post(`${API_URL}/request`, newRequest);
      alert('ส่งคำร้องการลาเรียบร้อยแล้ว!');
      fetchData(); // ดึงข้อมูลใหม่
      setLeaveForm({
        startDate: '',
        endDate: '',
        reason: '',
        leaveTypeId: leaveSummary.length > 0 ? leaveSummary[0].id : '',
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      alert('เกิดข้อผิดพลาดในการส่งคำร้อง');
    }
  };

  const filteredHistory = selectedLeaveTypeFilter === 'all'
    ? leaveHistory
    : leaveHistory.filter(leave => leave.leaveType === selectedLeaveTypeFilter);

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-gray-600 mt-2">จัดการคำร้องขอลาและติดตามสถานะการลาของคุณ</p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 สรุปสิทธิ์การลา</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaveSummary.map(summary => {
              const percentage = summary.quota > 0 ? (summary.used / summary.quota) * 100 : 0;
              const color = leaveTypeColors[summary.name] || '#ccc';
              return (
                <div key={summary.id} className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{summary.name}</h3>
                    <span className="text-xl font-bold" style={{ color: color }}>{summary.remaining}/{summary.quota}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="h-2.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
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

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">✍️ ยื่นคำร้องการลา</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">วันที่เริ่มลา *</label>
                        <input type="date" name="startDate" value={leaveForm.startDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">วันที่สิ้นสุด *</label>
                        <input type="date" name="endDate" value={leaveForm.endDate} onChange={handleInputChange} min={leaveForm.startDate} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทการลา *</label>
                        <select name="leaveTypeId" value={leaveForm.leaveTypeId} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                            {leaveSummary.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนวัน</label>
                        <input type="text" value={`${calculateDays(leaveForm.startDate, leaveForm.endDate)} วัน`} disabled className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"/>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">เหตุผลการลา *</label>
                        <textarea name="reason" value={leaveForm.reason} onChange={handleInputChange} rows="3" placeholder="กรุณาระบุเหตุผลการลา..." className="w-full px-4 py-2 border border-gray-300 rounded-lg" required></textarea>
                    </div>
                </div>
                <div className="mt-6">
                    <button type="submit" className="w-full bg-sky-400 text-black py-3 px-6 rounded-lg font-medium hover:bg-sky-500 transition-colors shadow-md">📤 ส่งคำร้องการลา</button>
                </div>
            </form>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">📜 ประวัติการลา</h2>
            <select value={selectedLeaveTypeFilter} onChange={(e) => setSelectedLeaveTypeFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="all">ทั้งหมด</option>
              {leaveSummary.map(type => (<option key={type.id} value={type.name}>{type.name}</option>))}
            </select>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ประเภท</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่เริ่ม</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่สิ้นสุด</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">จำนวนวัน</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHistory.map((leave, index) => (
                    <tr key={leave.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-3 py-1 text-xs font-medium rounded-full text-white" style={{ backgroundColor: leaveTypeColors[leave.leaveType] || '#ccc' }}>{leave.leaveType}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(leave.StartDate).toLocaleDateString('th-TH')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(leave.EndDate).toLocaleDateString('th-TH')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{leave.days} วัน</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          leave.Status === 'อนุมัติแล้ว' ? 'bg-green-100 text-green-800' :
                          leave.Status === 'ไม่อนุมัติ' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>{leave.Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className="mt-8">
            <Link to="/employee/dashboard" className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium">← กลับไปหน้าแรก</Link>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;