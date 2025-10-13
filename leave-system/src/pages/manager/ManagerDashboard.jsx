import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    CalendarIcon,
    ClipboardListIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    BellIcon,
    UserGroupIcon,
    ChartBarIcon,
    InformationCircleIcon,
    ExclamationCircleIcon,
    NewspaperIcon,
    ClipboardCheckIcon,
    UserIcon,
} from '@heroicons/react/outline';

const API_URL = 'http://localhost:5000/api';
// สมมติว่าเรารู้ ID ของ Manager ที่ล็อกอินอยู่
const CURRENT_MANAGER_ID = 1001;

const ManagerDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/manager/dashboard-stats/${CURRENT_MANAGER_ID}`);
                setDashboardData(response.data.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                alert("ไม่สามารถโหลดข้อมูลแดชบอร์ดได้");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);
    
    // ========================================
    // Mock Data ส่วนที่ยังไม่ได้เชื่อมต่อ API
    // ========================================
     const [notifications] = useState([
        { id: 1, type: 'info', title: 'คำขอลาใหม่จากพนักงาน', message: 'สมชาย ใจดี ยื่นคำขอลาพักร้อน 3 วัน', time: '1 ชั่วโมงที่แล้ว', link: '/manager/approve-leave', read: false },
        { id: 2, type: 'success', title: 'ระบบบันทึกอนุมัติสำเร็จ', message: 'คุณได้อนุมัติคำขอลาของ วิชัย มานะ แล้ว', time: '5 ชั่วโมงที่แล้ว', read: true },
     ]);

     const [companyNews] = useState([
        { id: 1, category: 'ประกาศ', categoryColor: 'bg-red-100 text-red-800', title: 'นโยบายการทำงานจากที่บ้าน', description: 'ปรับนโยบายการทำงานแบบ Hybrid เริ่ม 1 มีนาคม 2567', date: '2024-02-01', author: 'ฝ่ายบริหาร', isPinned: true },
        { id: 2, category: 'กิจกรรม', categoryColor: 'bg-purple-100 text-purple-800', title: 'กิจกรรมอบรมผู้นำทีม', description: 'เชิญหัวหน้างานทุกแผนกเข้าร่วมอบรมการสื่อสารเชิงสร้างสรรค์', date: '2024-01-28', author: 'ฝ่ายบุคคล', isPinned: false },
     ]);

    // ✅ Helper สำหรับ Notification
    const getNotificationConfig = (type) => {
        const configs = {
            success: { icon: CheckCircleIcon, bgColor: 'bg-green-50', borderColor: 'border-green-200', iconColor: 'text-green-600' },
            warning: { icon: ExclamationCircleIcon, bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', iconColor: 'text-yellow-600' },
            info: { icon: InformationCircleIcon, bgColor: 'bg-blue-50', borderColor: 'border-blue-200', iconColor: 'text-blue-600' },
            error: { icon: XCircleIcon, bgColor: 'bg-red-50', borderColor: 'border-red-200', iconColor: 'text-red-600' },
        };
        return configs[type] || configs.info;
    };

    // ✅ Quick Actions สำหรับหัวหน้า
    const quickActions = [
        { name: 'อนุมัติคำขอลา', icon: ClipboardCheckIcon, link: '/manager/approve-leave', color: 'bg-green-600 hover:bg-green-700', description: 'ตรวจสอบและอนุมัติคำขอลาของทีม' },
        { name: 'ประวัติการลาทีม', icon: ClipboardListIcon, link: '/manager/team-leave', color: 'bg-blue-600 hover:bg-blue-700', description: 'ดูประวัติการลาของทีมทั้งหมด' },
    ];
    
    if (loading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading Dashboard...</div>;
    }

    if (!dashboardData) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Failed to load data.</div>;
    }

    // Destructure data for easier access in JSX
    const { managerInfo, teamStats, recentRequests } = dashboardData;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            ยินดีต้อนรับ, {managerInfo.FirstName} {managerInfo.LastName} 👋
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {managerInfo.Position} • {managerInfo.DepartmentName} • ID: {managerInfo.EmployeeID}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm px-4 py-3 border border-gray-200">
                        <p className="text-sm text-gray-500">วันนี้</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {new Date().toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long',
                            })}
                        </p>
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
                            <div className="flex items-center gap-6 w-full">
                                <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-xl">
                                    <action.icon className="h-8 w-8" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-semibold mb-1">{action.name}</h3>
                                    <p className="text-sm opacity-90 leading-relaxed">{action.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-25 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* ✅ สรุปข้อมูลทีม (ใช้ข้อมูลจริง) */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ChartBarIcon className="h-6 w-6 text-sky-600" />
                                สรุปทีมของคุณ
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                                <div>
                                    <p className="text-3xl font-bold text-gray-900">{teamStats.totalEmployees}</p>
                                    <p className="text-gray-600">สมาชิกในทีม</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-blue-700">{teamStats.onLeaveToday}</p>
                                    <p className="text-gray-600">ลาวันนี้</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-yellow-700">{teamStats.pendingRequests}</p>
                                    <p className="text-gray-600">รออนุมัติ</p>
                                </div>
                            </div>
                        </div>

                        {/* ✅ คำขอลาล่าสุด (ใช้ข้อมูลจริง) */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ClipboardListIcon className="h-6 w-6 text-sky-600" />
                                คำขอลาล่าสุดของทีม
                            </h2>
                            <div className="space-y-4">
                                {recentRequests.map((req) => (
                                    <div key={req.id} className="flex justify-between items-center p-3 rounded-lg border hover:bg-gray-50 transition">
                                        <div>
                                            <p className="font-medium text-gray-900">{req.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {req.type} • {new Date(req.start).toLocaleDateString('th-TH')} - {new Date(req.end).toLocaleDateString('th-TH')} ({req.days} วัน)
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                                                req.status === 'อนุมัติแล้ว' ? 'bg-green-100 text-green-700'
                                                : req.status === 'รออนุมัติ' ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {req.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Link to="/manager/approve-leave" className="block text-sm text-sky-600 hover:text-sky-700 font-medium mt-4 text-center">
                                ดูทั้งหมด →
                            </Link>
                        </div>
                        
                        {/* ✅ ข่าวบริษัท (ยังใช้ Mock data) */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <NewspaperIcon className="h-6 w-6 text-sky-600" />
                                ข่าวสารบริษัท
                            </h2>
                            <div className="space-y-4">
                                {companyNews.map((news) => (
                                    <div key={news.id} className="p-4 rounded-lg border-l-4 bg-gray-50 hover:shadow-md transition cursor-pointer">
                                        <div className="flex items-start gap-2 mb-1">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${news.categoryColor}`}>
                                                {news.category}
                                            </span>
                                            {news.isPinned && (
                                                <span className="text-amber-600">📌</span>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-gray-900">{news.title}</h3>
                                        <p className="text-sm text-gray-600">{news.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">{news.author} • {news.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">

                        {/* ✅ การแจ้งเตือน (ยังใช้ Mock data) */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <BellIcon className="h-5 w-5 text-sky-600" />
                                    การแจ้งเตือน
                                </h2>
                                {notifications.filter((n) => !n.read).length > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {notifications.filter((n) => !n.read).length}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                {notifications.map((notif) => {
                                    const config = getNotificationConfig(notif.type);
                                    const Icon = config.icon;
                                    return (
                                        <div
                                            key={notif.id}
                                            className={`p-3 rounded-lg border ${config.borderColor} ${config.bgColor} hover:shadow-sm transition cursor-pointer`}
                                            onClick={() => notif.link && (window.location.href = notif.link)}
                                        >
                                            <div className="flex gap-3">
                                                <Icon className={`h-5 w-5 ${config.iconColor}`} />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                                                    <p className="text-xs text-gray-600">{notif.message}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <Link to="/manager/notifications" className="block text-center text-sm text-sky-600 hover:text-sky-700 font-medium mt-4 pt-4 border-t">
                                ดูการแจ้งเตือนทั้งหมด
                            </Link>
                        </div>

                        {/* ✅ เคล็ดลับ */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
                            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                <InformationCircleIcon className="h-5 w-5" />
                                เคล็ดลับสำหรับหัวหน้างาน
                            </h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li>💡 ตรวจสอบสิทธิ์การลาของทีมก่อนอนุมัติ</li>
                                <li>📋 บันทึกเหตุผลในการไม่อนุมัติให้ชัดเจน</li>
                                <li>📅 วางแผนทีมเมื่อมีคนลาหลายคนพร้อมกัน</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;

