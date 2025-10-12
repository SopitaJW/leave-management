// src/pages/manager/ApproveLeave.jsx
import React, { useState } from 'react';
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

const ApproveLeave = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // ข้อมูลตัวอย่าง
  const leaveRequests = [
    {
      id: 1,
      employeeName: 'สมชาย ใจดี',
      employeeId: 'EMP001',
      department: 'IT',
      leaveType: 'ลาพักร้อน',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      days: 3,
      reason: 'เดินทางท่องเที่ยวกับครอบครัว',
      status: 'pending',
      requestDate: '2024-01-15',
      remainingLeave: 5
    },
    {
      id: 2,
      employeeName: 'สมหญิง รักงาน',
      employeeId: 'EMP002',
      department: 'HR',
      leaveType: 'ลาป่วย',
      startDate: '2024-01-25',
      endDate: '2024-01-25',
      days: 1,
      reason: 'ไข้หวัด',
      status: 'pending',
      requestDate: '2024-01-24',
      remainingLeave: 8
    },
    {
      id: 3,
      employeeName: 'วิชัย มานะ',
      employeeId: 'EMP003',
      department: 'Sales',
      leaveType: 'ลากิจ',
      startDate: '2024-02-05',
      endDate: '2024-02-05',
      days: 1,
      reason: 'ติดธุระส่วนตัว',
      status: 'approved',
      requestDate: '2024-01-20',
      approvedDate: '2024-01-21',
      remainingLeave: 3
    },
    {
      id: 4,
      employeeName: 'นิดา สวยงาม',
      employeeId: 'EMP004',
      department: 'Marketing',
      leaveType: 'ลาพักร้อน',
      startDate: '2024-01-28',
      endDate: '2024-01-30',
      days: 3,
      reason: 'กลับบ้านต่างจังหวัด',
      status: 'rejected',
      requestDate: '2024-01-26',
      rejectedDate: '2024-01-27',
      rejectReason: 'ช่วงเวลาดังกล่าวมีงานเร่งด่วน',
      remainingLeave: 7
    }
  ];

  const leaveTypes = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'ลาพักร้อน', label: 'ลาพักร้อน' },
    { value: 'ลาป่วย', label: 'ลาป่วย' },
    { value: 'ลากิจ', label: 'ลากิจ' },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };

    const labels = {
      pending: 'รออนุมัติ',
      approved: 'อนุมัติแล้ว',
      rejected: 'ไม่อนุมัติ'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredRequests = leaveRequests
    .filter(req => req.status === activeTab)
    .filter(req => filterType === 'all' || req.leaveType === filterType)
    .filter(req => 
      req.employeeName.includes(searchTerm) || 
      req.employeeId.includes(searchTerm) ||
      req.department.includes(searchTerm)
    );

  const stats = {
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length,
  };

  const handleApprove = (id) => {
    console.log('Approve:', id);
    // API call here
  };

  const handleReject = (id) => {
    const reason = prompt('กรุณาระบุเหตุผลในการไม่อนุมัติ:');
    if (reason) {
      console.log('Reject:', id, 'Reason:', reason);
      // API call here
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">อนุมัติการลา</h1>
        <p className="text-gray-600 mt-2">จัดการคำขอลาของพนักงาน</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">รออนุมัติ</p>
              <p className="text-3xl font-bold text-yellow-800 mt-2">{stats.pending}</p>
            </div>
            <ClockIcon className="w-12 h-12 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">อนุมัติแล้ว</p>
              <p className="text-3xl font-bold text-green-800 mt-2">{stats.approved}</p>
            </div>
            <CheckCircleIcon className="w-12 h-12 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">ไม่อนุมัติ</p>
              <p className="text-3xl font-bold text-red-800 mt-2">{stats.rejected}</p>
            </div>
            <XCircleIcon className="w-12 h-12 text-red-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'text-yellow-600 border-b-2 border-yellow-600 bg-yellow-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ClockIcon className="w-5 h-5" />
              รออนุมัติ ({stats.pending})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'approved'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              อนุมัติแล้ว ({stats.approved})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'rejected'
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <XCircleIcon className="w-5 h-5" />
              ไม่อนุมัติ ({stats.rejected})
            </div>
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, รหัสพนักงาน, แผนก..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {leaveTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Leave Requests List */}
        <div className="divide-y divide-gray-200">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">ไม่พบรายการคำขอลา</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Employee Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {request.employeeName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {request.employeeName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {request.employeeId} • {request.department}
                        </p>
                      </div>
                    </div>

                    {/* Leave Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-start gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">ประเภท</p>
                          <p className="text-sm font-medium text-gray-800">{request.leaveType}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">วันที่ลา</p>
                          <p className="text-sm font-medium text-gray-800">
                            {request.startDate}
                            {request.startDate !== request.endDate && ` ถึง ${request.endDate}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">จำนวนวัน</p>
                          <p className="text-sm font-medium text-gray-800">{request.days} วัน</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">วันลาคงเหลือ</p>
                          <p className="text-sm font-medium text-gray-800">{request.remainingLeave} วัน</p>
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-xs text-gray-500 mb-1">เหตุผล</p>
                      <p className="text-sm text-gray-700">{request.reason}</p>
                    </div>

                    {/* Reject Reason (if rejected) */}
                    {request.status === 'rejected' && request.rejectReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                        <p className="text-xs text-red-600 mb-1 font-medium">เหตุผลที่ไม่อนุมัติ</p>
                        <p className="text-sm text-red-700">{request.rejectReason}</p>
                      </div>
                    )}

                    {/* Request Date */}
                    <p className="text-xs text-gray-500">
                      ยื่นคำขอเมื่อ: {request.requestDate}
                      {request.approvedDate && ` • อนุมัติเมื่อ: ${request.approvedDate}`}
                      {request.rejectedDate && ` • ไม่อนุมัติเมื่อ: ${request.rejectedDate}`}
                    </p>
                  </div>

                  {/* Status & Actions */}
                  <div className="ml-6 flex flex-col items-end gap-3">
                    {getStatusBadge(request.status)}
                    
                    {request.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          อนุมัติ
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          ไม่อนุมัติ
                        </button>
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

export default ApproveLeave;