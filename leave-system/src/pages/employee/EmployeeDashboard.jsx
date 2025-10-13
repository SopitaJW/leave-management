// src/pages/employee/EmployeeDashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  BellIcon,
  ChartBarIcon,
  ClipboardListIcon,
  NewspaperIcon,
  SpeakerphoneIcon,
  InformationCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/outline';

const EmployeeDashboard = () => {
  // ========================================
  // 🔌 API: ดึงข้อมูล Dashboard จาก Backend
  // ========================================
  const [userData] = useState({
    firstName: 'สุวพิชญ์',
    lastName: 'อาษา',
    employeeId: 'ID : 1004',
    department: 'IT',
    position: 'Software Developer',
    profileImage: null
  });

  const [leaveQuota] = useState({
    sickLeave: { used: 3, total: 30, remaining: 27 },
    businessLeave: { used: 2, total: 10, remaining: 8 },
    annualLeave: { used: 5, total: 15, remaining: 10 }
  });

  const [recentLeaves] = useState([
    {
      id: 1,
      type: 'ลาป่วย',
      startDate: '2024-01-15',
      endDate: '2024-01-16',
      days: 2,
      status: 'Approved'
    },
    {
      id: 2,
      type: 'ลาพักร้อน',
      startDate: '2024-02-20',
      endDate: '2024-02-22',
      days: 3,
      status: 'Pending'
    },
    {
      id: 3,
      type: 'ลากิจ',
      startDate: '2024-01-05',
      endDate: '2024-01-05',
      days: 1,
      status: 'Rejected'
    }
  ]);

  const [notifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'คำขอลาได้รับการอนุมัติ',
      message: 'คำขอลาป่วยวันที่ 15-16 ม.ค. 2567 ได้รับการอนุมัติแล้ว',
      time: '2 ชั่วโมงที่แล้ว',
      read: false,
      link: '/employee/leave-history'
    },
    {
      id: 2,
      type: 'info',
      title: 'เตือนความจำ',
      message: 'อย่าลืมยื่นใบลาพักร้อนล่วงหน้าอย่างน้อย 7 วัน',
      time: '5 ชั่วโมงที่แล้ว',
      read: false,
      link: null
    },
    {
      id: 3,
      type: 'warning',
      title: 'แจ้งปิดระบบ',
      message: 'ระบบจะปิดปรับปรุงวันที่ 30 ม.ค. เวลา 22:00-24:00 น.',
      time: '1 วันที่แล้ว',
      read: true,
      link: null
    },
    {
      id: 4,
      type: 'error',
      title: 'คำขอลาไม่ผ่านการอนุมัติ',
      message: 'คำขอลากิจวันที่ 5 ม.ค. ไม่ผ่านการอนุมัติ',
      time: '2 วันที่แล้ว',
      read: true,
      link: '/employee/leave-history'
    },
    {
      id: 5,
      type: 'info',
      title: 'อัพเดทนโยบายการลา',
      message: 'บริษัทได้ปรับปรุงนโยบายการลาป่วย มีผลตั้งแต่ 1 ก.พ. 2567',
      time: '3 วันที่แล้ว',
      read: true,
      link: null
    }
  ]);

  const [companyNews] = useState([
    {
      id: 1,
      category: 'ประกาศ',
      categoryColor: 'bg-red-100 text-red-800',
      title: 'ปรับเปลี่ยนวันหยุดประจำปี 2567',
      description: 'บริษัทขอแจ้งเปลี่ยนแปลงวันหยุดชดเชยให้เป็นวันที่ 3 มกราคม แทนวันที่ 2 มกราคม',
      date: '2024-01-10',
      author: 'ฝ่ายทรัพยากรบุคคล',
      isPinned: true
    },
    {
      id: 2,
      category: 'กิจกรรม',
      categoryColor: 'bg-purple-100 text-purple-800',
      title: 'งานสังสรรค์ปีใหม่ 2567',
      description: 'ขอเชิญพนักงานทุกท่านร่วมงานสังสรรค์ต้อนรับปีใหม่ วันที่ 15 มกราคม เวลา 18:00 น.',
      date: '2024-01-08',
      author: 'ฝ่ายสวัสดิการ',
      isPinned: false
    },
    {
      id: 3,
      category: 'นโยบาย',
      categoryColor: 'bg-blue-100 text-blue-800',
      title: 'การทำงานแบบ Hybrid Work',
      description: 'บริษัทเปิดให้พนักงานสามารถทำงานที่บ้านได้สัปดาห์ละ 2 วัน ตั้งแต่วันที่ 1 กุมภาพันธ์',
      date: '2024-01-05',
      author: 'ฝ่ายบริหาร',
      isPinned: false
    }
  ]);

  const [teamOnLeave] = useState([
    { id: 1, name: 'สมหญิง รักงาน', type: 'ลาป่วย', avatar: null },
    { id: 2, name: 'สมศักดิ์ ทำดี', type: 'ลากิจ', avatar: null }
  ]);

  const stats = {
    totalLeaves: recentLeaves.length,
    approved: recentLeaves.filter(l => l.status === 'Approved').length,
    pending: recentLeaves.filter(l => l.status === 'Pending').length,
    rejected: recentLeaves.filter(l => l.status === 'Rejected').length
  };

  // ✅ Quick Actions - ใช้ ClipboardListIcon จาก import แล้ว
  const quickActions = [
    {
      name: 'ยื่นใบลา',
      icon: DocumentTextIcon,
      link: '/employee/leave-request',
      color: 'bg-green-600 hover:bg-viridian-1000',
      description: 'ยื่นคำขอลาใหม่'
    },
    {
      name: 'ประวัติการลา',
      icon: ClipboardListIcon,
      link: '/employee/leave-history',
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'ดูประวัติการลาทั้งหมด'
    },
    // {
    //   name: 'ปฏิทินการลา',
    //   icon: CalendarIcon,
    //   link: '/employee/calendar',
    //   color: 'bg-purple-600 hover:bg-purple-700',
    //   description: 'ดูปฏิทินการลา'
    // }
  ];

  // ✅ Notification Icon Helper
  const getNotificationConfig = (type) => {
    const configs = {
      success: {
        icon: CheckCircleIcon,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        iconColor: 'text-green-600'
      },
      warning: {
        icon: ExclamationCircleIcon,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconColor: 'text-yellow-600'
      },
      info: {
        icon: InformationCircleIcon,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600'
      },
      error: {
        icon: XCircleIcon,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600'
      }
    };
    return configs[type] || configs.info;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                สวัสดี, {userData.firstName} {userData.lastName} 👋
              </h1>
              <p className="mt-2 text-gray-600">
                {userData.position} • {userData.department} • รหัสพนักงาน: {userData.employeeId}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm px-4 py-3 border border-gray-200">
              <p className="text-sm text-gray-500">วันนี้</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`${action.color} text-white rounded-2xl px-8 py-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-between w-full`}
            >
              {/* Left Section */}
              <div className="flex items-center gap-6 w-full">
                <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-xl">
                  <action.icon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-1">{action.name}</h3>
                  <p className="text-sm opacity-90 leading-relaxed">{action.description}</p>
                </div>
              </div>

              {/* Right Arrow */}
              <div className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-25 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">

            {/* Company News */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <NewspaperIcon className="h-6 w-6 text-viridian-600" />
                  ข่าวสารบริษัท
                </h2>
                <Link to="/employee/news" className="text-sm text-viridian-600 hover:text-viridian-700 font-medium">
                  ดูทั้งหมด →
                </Link>
              </div>

              <div className="space-y-4">
                {companyNews.map((news) => (
                  <div
                    key={news.id}
                    className={`p-4 rounded-lg border-l-4 transition-all hover:shadow-md cursor-pointer ${news.isPinned
                      ? 'bg-amber-50 border-amber-500'
                      : 'bg-gray-50 border-gray-300 hover:border-viridian-500'
                      }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${news.categoryColor}`}>
                        {news.category}
                      </span>
                      {news.isPinned && (
                        <span className="text-amber-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78-.07 1.624.49 2.08.56.455 1.35.5 1.96.144L9 14.656V15a1 1 0 01-1 1H4a1 1 0 01-1-1v-.344l2.368-1.106A3.99 3.99 0 017 10.274z" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-viridian-600 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {news.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {new Date(news.date).toLocaleDateString('th-TH', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span>•</span>
                      <span>{news.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-viridian-600" />
                  การแจ้งเตือน
                </h2>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {notifications.slice(0, 5).map((notif) => {
                  const config = getNotificationConfig(notif.type);
                  const IconComponent = config.icon;

                  return (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${notif.read
                        ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        : `${config.bgColor} ${config.borderColor} hover:shadow-sm`
                        }`}
                      onClick={() => {
                        if (notif.link) window.location.href = notif.link;
                      }}
                    >
                      <div className="flex gap-3">
                        <div className={`flex-shrink-0 ${config.iconColor}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notif.title}
                          </p>
                          <p className={`text-xs mt-1 ${notif.read ? 'text-gray-500' : 'text-gray-600'}`}>
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/employee/notifications"
                className="block text-center text-sm text-viridian-600 hover:text-viridian-700 font-medium mt-4 pt-4 border-t"
              >
                ดูการแจ้งเตือนทั้งหมด
              </Link>
            </div>


            {/* Tips & Reminders */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <InformationCircleIcon className="h-5 w-5" />
                เคล็ดลับ
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">💡</span>
                  <span>ยื่นใบลาล่วงหน้าอย่างน้อย 3 วันทำการ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">📋</span>
                  <span>ตรวจสอบสิทธิ์การลาก่อนยื่นคำขอ</span>
                </li>
                
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeDashboard;
