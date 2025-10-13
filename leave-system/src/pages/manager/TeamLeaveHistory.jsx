import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ClipboardListIcon,
    SearchIcon,
    CalendarIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationCircleIcon,
    UserCircleIcon // Icon สำหรับพนักงาน
} from '@heroicons/react/outline';

// --- Configurations ---
const API_URL = 'http://localhost:5000/api';
const CURRENT_MANAGER_ID = 1001; // ID ของ Manager ที่ล็อกอินอยู่

// --- Helper Component for Avatar ---
const Avatar = ({ name }) => {
    const colors = [
        'bg-blue-500', 'bg-green-500', 'bg-purple-500',
        'bg-red-500', 'bg-yellow-600', 'bg-indigo-500',
        'bg-pink-500', 'bg-teal-500'
    ];

    if (!name) name = '?';

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    const color = colors[index];

    return (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${color}`}>
            {name.charAt(0)}
        </div>
    );
};


const TeamLeaveHistory = () => {
    // --- State Management ---
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterType, setFilterType] = useState('All');

    // --- Data Fetching ---
    useEffect(() => {
        const fetchTeamHistory = async () => {
            try {
                const params = {
                    search: searchTerm,
                    status: filterStatus,
                    type: filterType,
                };
                const response = await axios.get(`${API_URL}/manager/team-history/${CURRENT_MANAGER_ID}`, { params });
                setLeaveRequests(response.data.data);
            } catch (error) {
                console.error("Error fetching team leave history:", error);
                alert("ไม่สามารถดึงข้อมูลประวัติการลาของทีมได้");
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        const debounceFetch = setTimeout(() => {
            fetchTeamHistory();
        }, 300);

        return () => clearTimeout(debounceFetch);
    }, [searchTerm, filterStatus, filterType]);

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
    const stats = {
        total: leaveRequests.length,
        approved: leaveRequests.filter(r => r.Status === 'อนุมัติแล้ว').length,
        pending: leaveRequests.filter(r => r.Status === 'รออนุมัติ').length,
        rejected: leaveRequests.filter(r => r.Status === 'ไม่อนุมัติ').length,
    };

    if (loading && leaveRequests.length === 0) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">กำลังโหลดข้อมูล...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <ClipboardListIcon className="h-8 w-8 text-sky-600" />
                        <h1 className="text-3xl font-bold text-gray-900">ประวัติการลาทีม</h1>
                    </div>
                    <p className="text-gray-600">ดูประวัติการยื่นใบลาทั้งหมดของสมาชิกในทีม</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm text-gray-600">ทั้งหมด</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm text-gray-600">อนุมัติ</p>
                        <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm text-gray-600">รอดำเนินการ</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <p className="text-sm text-gray-600">ไม่อนุมัติ</p>
                        <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อพนักงาน, เหตุผล, ประเภท..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                <option value="All">ทั้งหมด</option>
                                <option value="Approved">อนุมัติ</option>
                                <option value="Pending">รอดำเนินการ</option>
                                <option value="Rejected">ไม่อนุมัติ</option>
                            </select>
                        </div>
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

                {/* Team Leave History Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden relative">
                    {loading && <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10"><p>กำลังกรองข้อมูล...</p></div>}
                    {leaveRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบข้อมูล</h3>
                            <p className="mt-1 text-sm text-gray-500">ทีมของคุณยังไม่มีประวัติการลา หรือไม่พบรายการที่ตรงกับเงื่อนไข</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">พนักงาน</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ประเภท</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่ลา</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">จำนวนวัน</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">เหตุผล</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {leaveRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={request.employeeName} />
                                                    <span className="text-sm font-medium text-gray-900">{request.employeeName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap"><LeaveTypeBadge type={request.leaveType} /></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(request.StartDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.days} วัน</td>
                                            <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={request.Status} /></td>
                                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{request.Reason || '-'}</td>
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

export default TeamLeaveHistory;