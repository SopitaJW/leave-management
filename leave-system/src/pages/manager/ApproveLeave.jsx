import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    CalendarIcon,
    UserIcon,
    DocumentTextIcon,
    FilterIcon,
    SearchIcon
} from '@heroicons/react/outline';


const API_URL = 'http://localhost:5000/api';

const ApproveLeave = () => {
    const [allRequests, setAllRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected'
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    // --- Data Fetching ---
    const fetchData = async () => {
        setLoading(true);
        try {
            // ดึงข้อมูลแยกตามสถานะเพื่อจัดการได้ง่าย
            const resPending = await axios.get(`${API_URL}/manager/requests`, { params: { status: 'pending' } });
            const resApproved = await axios.get(`${API_URL}/manager/requests`, { params: { status: 'approved' } });
            const resRejected = await axios.get(`${API_URL}/manager/requests`, { params: { status: 'rejected' } });

            // แปลง status ที่ได้จาก DB (ภาษาไทย) กลับเป็นภาษาอังกฤษสำหรับ Frontend
            const transformData = (data, status) => data.map(item => ({ ...item, status }));
            
            setAllRequests([
                ...transformData(resPending.data.data, 'pending'),
                ...transformData(resApproved.data.data, 'approved'),
                ...transformData(resRejected.data.data, 'rejected'),
            ]);
        } catch (error) {
            console.error("Failed to fetch leave requests", error);
            alert("ไม่สามารถดึงข้อมูลคำขอลาได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Filtering Logic ---
    useEffect(() => {
        let requests = allRequests
            .filter(req => req.status === activeTab)
            .filter(req => filterType === 'all' || req.leaveType === filterType);
        
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            requests = requests.filter(req =>
                (req.employeeName || '').toLowerCase().includes(lowercasedTerm) ||
                (req.employeeId || '').toString().toLowerCase().includes(lowercasedTerm) ||
                (req.department || '').toLowerCase().includes(lowercasedTerm)
            );
        }

        setFilteredRequests(requests);
    }, [activeTab, searchTerm, filterType, allRequests]);


    // --- Actions ---
    const handleApprove = async (id) => {
        if (!window.confirm('คุณต้องการอนุมัติคำขอนี้ใช่หรือไม่?')) return;
        try {
            await axios.put(`${API_URL}/manager/requests/${id}`, {
                status: 'อนุมัติแล้ว',
                comment: 'อนุมัติเรียบร้อย'
            });
            alert('อนุมัติคำขอสำเร็จ');
            fetchData(); // โหลดข้อมูลใหม่
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการอนุมัติ');
        }
    };

    const handleReject = async (id) => {
        const reason = prompt('กรุณาระบุเหตุผลในการไม่อนุมัติ (จำเป็น):');
        if (reason && reason.trim() !== '') {
            try {
                await axios.put(`${API_URL}/manager/requests/${id}`, {
                    status: 'ไม่อนุมัติ',
                    comment: reason
                });
                alert('ปฏิเสธคำขอสำเร็จ');
                fetchData(); // โหลดข้อมูลใหม่
            } catch (error) {
                alert('เกิดข้อผิดพลาดในการปฏิเสธคำขอ');
            }
        } else if (reason !== null) {
            alert('กรุณาระบุเหตุผลในการไม่อนุมัติ');
        }
    };
    
    // --- UI Helpers & Constants ---
    const leaveTypes = [
        { value: 'all', label: 'ทุกประเภท' },
        { value: 'ลาพักร้อน', label: 'ลาพักร้อน' },
        { value: 'ลาป่วย', label: 'ลาป่วย' },
        { value: 'ลากิจ', label: 'ลากิจ' },
        { value: 'ลาคลอด', label: 'ลาคลอด' },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            approved: 'bg-green-100 text-green-800 border-green-300',
            rejected: 'bg-red-100 text-red-800 border-red-300'
        };
        const labels = { pending: 'รออนุมัติ', approved: 'อนุมัติแล้ว', rejected: 'ไม่อนุมัติ' };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const stats = {
        pending: allRequests.filter(r => r.status === 'pending').length,
        approved: allRequests.filter(r => r.status === 'approved').length,
        rejected: allRequests.filter(r => r.status === 'rejected').length,
    };
    
    // --- JSX Render ---
    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">อนุมัติการลา</h1>
                <p className="text-gray-600 mt-2">จัดการคำขอลาของพนักงานในทีมของคุณ</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-600 text-sm font-medium">รออนุมัติ</p>
                            <p className="text-3xl font-bold text-yellow-800 mt-2">{stats.pending}</p>
                        </div>
                        <ClockIcon className="w-12 h-12 text-yellow-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">อนุมัติแล้ว</p>
                            <p className="text-3xl font-bold text-green-800 mt-2">{stats.approved}</p>
                        </div>
                        <CheckCircleIcon className="w-12 h-12 text-green-400" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-600 text-sm font-medium">ไม่อนุมัติ</p>
                            <p className="text-3xl font-bold text-red-800 mt-2">{stats.rejected}</p>
                        </div>
                        <XCircleIcon className="w-12 h-12 text-red-400" />
                    </div>
                </div>
            </div>

            {/* Tabs & Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex border-b border-gray-200">
                    <button onClick={() => setActiveTab('pending')} className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'pending' ? 'text-yellow-600 border-b-2 border-yellow-600 bg-yellow-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <div className="flex items-center justify-center gap-2"><ClockIcon className="w-5 h-5" />รออนุมัติ ({stats.pending})</div>
                    </button>
                    <button onClick={() => setActiveTab('approved')} className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'approved' ? 'text-green-600 border-b-2 border-green-600 bg-green-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <div className="flex items-center justify-center gap-2"><CheckCircleIcon className="w-5 h-5" />อนุมัติแล้ว ({stats.approved})</div>
                    </button>
                    <button onClick={() => setActiveTab('rejected')} className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'rejected' ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <div className="flex items-center justify-center gap-2"><XCircleIcon className="w-5 h-5" />ไม่อนุมัติ ({stats.rejected})</div>
                    </button>
                </div>

                <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input type="text" placeholder="ค้นหาชื่อ, รหัสพนักงาน, แผนก..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div className="relative">
                            <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white w-full md:w-auto">
                                {leaveTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Leave Requests List */}
                <div className="divide-y divide-gray-200">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading...</div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg">ไม่พบรายการคำขอลา</p>
                        </div>
                    ) : (
                        filteredRequests.map((request) => (
                            <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col md:flex-row items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                                                {request.employeeName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">{request.employeeName}</h3>
                                                <p className="text-sm text-gray-600">{request.employeeId} • {request.department}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                            <div className="flex items-start gap-2"><DocumentTextIcon className="w-5 h-5 text-gray-400 mt-0.5" /><div><p className="text-xs text-gray-500">ประเภท</p><p className="text-sm font-medium text-gray-800">{request.leaveType}</p></div></div>
                                            <div className="flex items-start gap-2"><CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" /><div><p className="text-xs text-gray-500">วันที่ลา</p><p className="text-sm font-medium text-gray-800">{new Date(request.StartDate).toLocaleDateString('th-TH')} {request.StartDate !== request.EndDate && ` - ${new Date(request.EndDate).toLocaleDateString('th-TH')}`}</p></div></div>
                                            <div className="flex items-start gap-2"><ClockIcon className="w-5 h-5 text-gray-400 mt-0.5" /><div><p className="text-xs text-gray-500">จำนวนวัน</p><p className="text-sm font-medium text-gray-800">{request.days} วัน</p></div></div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
                                            <p className="text-xs text-gray-500 mb-1 font-medium">เหตุผล</p>
                                            <p className="text-sm text-gray-700">{request.Reason}</p>
                                        </div>
                                        {request.status === 'rejected' && request.rejectReason && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3"><p className="text-xs text-red-600 mb-1 font-medium">เหตุผลที่ไม่อนุมัติ</p><p className="text-sm text-red-700">{request.rejectReason}</p></div>
                                        )}
                                        <p className="text-xs text-gray-500">ยื่นคำขอเมื่อ: {new Date(request.RequestDate).toLocaleDateString('th-TH')}</p>
                                    </div>
                                    <div className="ml-0 md:ml-6 mt-4 md:mt-0 flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                                        {getStatusBadge(request.status)}
                                        {request.status === 'pending' && (
                                            <div className="flex gap-2 mt-2 w-full">
                                                <button onClick={() => handleApprove(request.id)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm font-medium"><CheckCircleIcon className="w-4 h-4" />อนุมัติ</button>
                                                <button onClick={() => handleReject(request.id)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-sm font-medium"><XCircleIcon className="w-4 h-4" />ไม่อนุมัติ</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// บรรทัดนี้สำคัญมาก!
export default ApproveLeave;