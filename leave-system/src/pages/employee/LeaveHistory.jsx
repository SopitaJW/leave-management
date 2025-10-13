import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ClipboardListIcon,
    SearchIcon,
    CalendarIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationCircleIcon
} from '@heroicons/react/outline';

// --- Configurations ---
const API_URL = 'http://localhost:5000/api';
const CURRENT_EMPLOYEE_ID = 1002; // สมมติว่าเป็นพนักงานที่ล็อกอินอยู่

const LeaveHistory = () => {
    // --- State Management ---
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterType, setFilterType] = useState('All');

    // --- Data Fetching ---
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // setLoading(true) ถูกย้ายไปอยู่นอก timeout เพื่อให้ UI ตอบสนองทันที
                const params = {
                    search: searchTerm,
                    status: filterStatus,
                    type: filterType,
                };
                const response = await axios.get(`${API_URL}/history/${CURRENT_EMPLOYEE_ID}`, { params });
                setLeaveRequests(response.data.data);
            } catch (error) {
                console.error("Error fetching leave history:", error);
                alert("ไม่สามารถดึงข้อมูลประวัติการลาได้");
            } finally {
                setLoading(false);
            }
        };

        setLoading(true); // แสดง Loading ทันทีที่ filter เปลี่ยน
        const debounceFetch = setTimeout(() => {
            fetchHistory();
        }, 300); // หน่วงเวลา 300ms ก่อนยิง API

        return () => clearTimeout(debounceFetch); // Clear timeout ถ้า user พิมพ์ต่อ
    }, [searchTerm, filterStatus, filterType]); // ทำงานใหม่ทุกครั้งที่ filter เปลี่ยน

    // --- Sub-components ---
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            'อนุมัติแล้ว': { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircleIcon className="h-4 w-4" />, label: 'อนุมัติ' },
            'รออนุมัติ': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <ClockIcon className="h-4 w-4" />, label: 'รอดำเนินการ' },
            'ไม่อนุมัติ': { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircleIcon className="h-4 w-4" />, label: 'ไม่อนุมัติ' }
        };
        const config = statusConfig[status] || statusConfig['รออนุมัติ'];
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.icon}
                {config.label}
            </span>
        );
    };

    const LeaveTypeBadge = ({ type }) => {
        const typeColors = {
            'ลาป่วย': 'bg-blue-100 text-blue-800',
            'ลาพักร้อน': 'bg-purple-100 text-purple-800',
            'ลากิจ': 'bg-orange-100 text-orange-800',
            'ลาคลอด': 'bg-pink-100 text-pink-800',
        };
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
                {type}
            </span>
        );
    };

    // --- Calculated Statistics ---
    // คำนวณค่าสถิติหลังจาก fetch ข้อมูลมาใหม่เสมอ
    const stats = {
        total: leaveRequests.length,
        approved: leaveRequests.filter(r => r.Status === 'อนุมัติแล้ว').length,
        pending: leaveRequests.filter(r => r.Status === 'รออนุมัติ').length,
        rejected: leaveRequests.filter(r => r.Status === 'ไม่อนุมัติ').length
    };

    // --- Render ---
    if (loading && leaveRequests.length === 0) { // แสดง Loading แบบเต็มหน้าจอแค่ครั้งแรก
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <ClipboardListIcon className="h-8 w-8 text-sky-600" />
                        <h1 className="text-3xl font-bold text-gray-900">ประวัติการลา</h1>
                    </div>
                    <p className="text-gray-600">ดูประวัติการยื่นใบลาทั้งหมดของคุณ</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* ... โค้ดส่วนสถิติเหมือนเดิมทุกประการ ... */}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาเหตุผลหรือประเภทการลา..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Filter by Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                <option value="All">ทั้งหมด</option>
                                <option value="Approved">อนุมัติ</option>
                                <option value="Pending">รอดำเนินการ</option>
                                <option value="Rejected">ไม่อนุมัติ</option>
                            </select>
                        </div>

                        {/* Filter by Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทการลา</label>
                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                <option value="All">ทั้งหมด</option>
                                <option value="ลาป่วย">ลาป่วย</option>
                                <option value="ลาพักร้อน">ลาพักร้อน</option>
                                <option value="ลากิจ">ลากิจ</option>
                                <option value="ลาคลอด">ลาคลอด</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Leave Requests Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden relative">
                    {loading && <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10"><p>กำลังกรองข้อมูล...</p></div>}
                    {leaveRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบข้อมูล</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm || filterStatus !== 'All' || filterType !== 'All'
                                    ? 'ไม่พบรายการที่ตรงกับเงื่อนไขที่เลือก'
                                    : 'คุณยังไม่มีประวัติการลา'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ประเภท</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่ลา</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">จำนวนวัน</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">เหตุผล</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่ยื่น</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">หมายเหตุ</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {leaveRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap"><LeaveTypeBadge type={request.leaveType} /></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                                                    <span>{new Date(request.StartDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                    {request.StartDate !== request.EndDate && (
                                                        <>
                                                            <span className="text-gray-400">-</span>
                                                            <span>{new Date(request.EndDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{request.days} วัน</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{request.Reason}</td>
                                            <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={request.Status} /></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.RequestDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{request.ApproverComment || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaveHistory;