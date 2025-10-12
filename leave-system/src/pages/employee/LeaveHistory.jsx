// src/pages/employee/LeaveHistory.jsx
import React, { useState } from 'react';
import { 
  ClipboardListIcon,
  SearchIcon,
  FilterIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/outline';

const LeaveHistory = () => {
  // ========================================
  // 🔌 API: ดึงข้อมูลประวัติการลาจาก Backend
  // ========================================
  // TODO: เปลี่ยนจาก mock data เป็น API call
  // Example:
  // const { data: leaveRequests, isLoading, error } = useQuery('leaveHistory', fetchLeaveHistory);
  // 
  // async function fetchLeaveHistory() {
  //   const response = await axios.get('/api/leave/my-requests', {
  //     headers: { Authorization: `Bearer ${token}` }
  //   });
  //   return response.data;
  // }
  
  const [leaveRequests] = useState([
    {
      id: 1,
      leaveType: 'ลาป่วย',
      leaveTypeId: 1,
      startDate: '2024-01-15',
      endDate: '2024-01-16',
      totalDays: 2,
      reason: 'ป่วยเป็นไข้',
      status: 'Approved',
      requestDate: '2024-01-10',
      approvedDate: '2024-01-11',
      approverComment: 'อนุมัติ หายไวๆ นะครับ'
    },
    {
      id: 2,
      leaveType: 'ลาพักร้อน',
      leaveTypeId: 2,
      startDate: '2024-02-20',
      endDate: '2024-02-22',
      totalDays: 3,
      reason: 'ไปเที่ยวกับครอบครัว',
      status: 'Pending',
      requestDate: '2024-01-25',
      approvedDate: null,
      approverComment: null
    },
    {
      id: 3,
      leaveType: 'ลากิจ',
      leaveTypeId: 3,
      startDate: '2024-01-05',
      endDate: '2024-01-05',
      totalDays: 1,
      reason: 'ติดธุระส่วนตัว',
      status: 'Rejected',
      requestDate: '2024-01-02',
      approvedDate: '2024-01-03',
      approverComment: 'ช่วงนี้มีงานเยอะ ขอให้เลื่อนออกไปก่อน'
    },
    {
      id: 4,
      leaveType: 'ลาพักร้อน',
      leaveTypeId: 2,
      startDate: '2023-12-25',
      endDate: '2023-12-27',
      totalDays: 3,
      reason: 'เทศกาลปีใหม่',
      status: 'Approved',
      requestDate: '2023-12-01',
      approvedDate: '2023-12-02',
      approverComment: 'อนุมัติ'
    },
    {
      id: 5,
      leaveType: 'ลาป่วย',
      leaveTypeId: 1,
      startDate: '2023-11-10',
      endDate: '2023-11-10',
      totalDays: 1,
      reason: 'ปวดท้อง',
      status: 'Approved',
      requestDate: '2023-11-09',
      approvedDate: '2023-11-09',
      approverComment: 'อนุมัติ'
    }
  ]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  // ========================================
  // 🎯 Filter Logic
  // ========================================
  const filteredRequests = leaveRequests.filter(request => {
    const matchSearch = 
      request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'All' || request.status === filterStatus;
    const matchType = filterType === 'All' || request.leaveType === filterType;

    return matchSearch && matchStatus && matchType;
  });

  // ========================================
  // 🎨 Status Badge Component
  // ========================================
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircleIcon className="h-4 w-4" />,
        label: 'อนุมัติ'
      },
      Pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <ClockIcon className="h-4 w-4" />,
        label: 'รอดำเนินการ'
      },
      Rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <XCircleIcon className="h-4 w-4" />,
        label: 'ไม่อนุมัติ'
      }
    };

    const config = statusConfig[status];

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // ========================================
  // 🎨 Leave Type Badge
  // ========================================
  const LeaveTypeBadge = ({ type }) => {
    const typeColors = {
      'ลาป่วย': 'bg-blue-100 text-blue-800',
      'ลาพักร้อน': 'bg-purple-100 text-purple-800',
      'ลากิจ': 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    );
  };

  // ========================================
  // 📊 Statistics
  // ========================================
  const stats = {
    total: leaveRequests.length,
    approved: leaveRequests.filter(r => r.status === 'Approved').length,
    pending: leaveRequests.filter(r => r.status === 'Pending').length,
    rejected: leaveRequests.filter(r => r.status === 'Rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardListIcon className="h-8 w-8 text-viridian-600" />
            <h1 className="text-3xl font-bold text-gray-900">ประวัติการลา</h1>
          </div>
          <p className="text-gray-600">ดูประวัติการยื่นใบลาทั้งหมดของคุณ</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <ClipboardListIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">อนุมัติ</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">รอดำเนินการ</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ไม่อนุมัติ</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ค้นหา
              </label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาเหตุผลหรือประเภทการลา..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter by Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สถานะ
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
              >
                <option value="All">ทั้งหมด</option>
                <option value="Approved">อนุมัติ</option>
                <option value="Pending">รอดำเนินการ</option>
                <option value="Rejected">ไม่อนุมัติ</option>
              </select>
            </div>

            {/* Filter by Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภทการลา
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
              >
                {/* 🔌 API: ดึงรายการประเภทการลาจาก Backend */}
                {/* TODO: Replace with dynamic leave types from API */}
                {/* Example: leaveTypes.map(type => <option value={type.id}>{type.name}</option>) */}
                <option value="All">ทั้งหมด</option>
                <option value="ลาป่วย">ลาป่วย</option>
                <option value="ลาพักร้อน">ลาพักร้อน</option>
                <option value="ลากิจ">ลากิจ</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              แสดงผล <span className="font-semibold text-gray-900">{filteredRequests.length}</span> รายการ
              {filteredRequests.length !== leaveRequests.length && (
                <span> จากทั้งหมด {leaveRequests.length} รายการ</span>
              )}
            </p>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredRequests.length === 0 ? (
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
            <>
              {/* Desktop Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ประเภท
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        วันที่ลา
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        จำนวนวัน
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        เหตุผล
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        สถานะ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        วันที่ยื่น
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        หมายเหตุ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <LeaveTypeBadge type={request.leaveType} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                            <span>
                              {new Date(request.startDate).toLocaleDateString('th-TH', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            {request.startDate !== request.endDate && (
                              <>
                                <span className="text-gray-400">-</span>
                                <span>
                                  {new Date(request.endDate).toLocaleDateString('th-TH', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {request.totalDays} วัน
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900 max-w-xs truncate">
                            {request.reason}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.requestDate).toLocaleDateString('th-TH', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-500 max-w-xs truncate">
                            {request.approverComment || '-'}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default LeaveHistory;
