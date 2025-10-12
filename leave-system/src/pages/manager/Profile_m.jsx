// src/pages/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  UserCircleIcon,
  MailIcon,
  PhoneIcon,
  LocationMarkerIcon,
  OfficeBuildingIcon,
  IdentificationIcon,
  CalendarIcon,
  ShieldCheckIcon,
  PencilIcon,
  CameraIcon,
  SaveIcon,
  XIcon,
  BriefcaseIcon,
  ClockIcon
} from '@heroicons/react/outline';

const Profile_m = () => {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Mock Data - สำหรับ Manager (สมหญิง รักงาน)
  const [profileData, setProfileData] = useState({
    employeeId: 'MNG002',
    firstName: 'สมหญิง',
    lastName: 'รักงาน',
    email: 'somying@example.com',
    phone: '089-222-5566',
    position: 'IT Manager',
    department: 'IT Department',
    role: 'Manager',
    startDate: '2019-03-20',
    birthDate: '1989-12-10',
    nationalId: '1103700899991',
    address: '299/45 หมู่บ้านสุขสบาย แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพฯ 10230',
    emergencyContact: {
      name: 'สมชาย รักงาน',
      relation: 'คู่สมรส',
      phone: '081-123-4567'
    },
    leaveQuota: {
      sickLeave: { used: 1, total: 30, remaining: 29 },
      businessLeave: { used: 2, total: 12, remaining: 10 },
      annualLeave: { used: 3, total: 20, remaining: 17 }
    }
  });

  // ✅ เพิ่ม state สำหรับการแก้ไขข้อมูล
  const [formData, setFormData] = useState(profileData);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setProfileData(formData);
      setIsEditing(false);
      alert('บันทึกข้อมูลเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      SuperAdmin: { bg: 'bg-red-100', text: 'text-red-800', label: 'ผู้ดูแลระบบสูงสุด' },
      Admin: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'ผู้ดูแลระบบ' },
      Manager: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'หัวหน้างาน' },
      Employee: { bg: 'bg-green-100', text: 'text-green-800', label: 'พนักงาน' }
    };
    const badge = badges[role] || badges.Employee;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        <ShieldCheckIcon className="h-4 w-4 mr-1" />
        {badge.label}
      </span>
    );
  };

  const calculateWorkDuration = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return `${years} ปี ${months} เดือน`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <UserCircleIcon className="h-9 w-9 text-viridian-600" />
            ข้อมูลส่วนตัว
          </h1>
          <p className="text-gray-600 mt-2">จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-viridian-600 to-viridian-700"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                  {profileImage || profileData.profileImage ? (
                    <img src={profileImage || profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-viridian-100 flex items-center justify-center">
                      <UserCircleIcon className="h-20 w-20 text-viridian-600" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-2 right-2 w-10 h-10 bg-viridian-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-viridian-700 transition-colors"
                >
                  <CameraIcon className="h-5 w-5 text-white" />
                </label>
                <input id="profile-image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-gray-600 mt-1">{profileData.position}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  {getRoleBadge(profileData.role)}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <IdentificationIcon className="h-4 w-4 mr-1" />
                    {profileData.employeeId}
                  </span>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 bg-viridian-600 text-white rounded-lg hover:bg-viridian-700 transition-colors"
                  >
                    <PencilIcon className="h-5 w-5 mr-2" />
                    แก้ไขข้อมูล
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <SaveIcon className="h-5 w-5 mr-2" />
                      บันทึก
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(profileData);
                      }}
                      className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <XIcon className="h-5 w-5 mr-2" />
                      ยกเลิก
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Leave Quota (ขวา) */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">สิทธิ์การลา</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">ลาป่วย</span>
                <span className="text-sm text-gray-600">
                  {profileData.leaveQuota.sickLeave.remaining}/{profileData.leaveQuota.sickLeave.total} วัน
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${(profileData.leaveQuota.sickLeave.remaining / profileData.leaveQuota.sickLeave.total) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">ลากิจ</span>
                <span className="text-sm text-gray-600">
                  {profileData.leaveQuota.businessLeave.remaining}/{profileData.leaveQuota.businessLeave.total} วัน
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{
                    width: `${(profileData.leaveQuota.businessLeave.remaining / profileData.leaveQuota.businessLeave.total) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">ลาพักร้อน</span>
                <span className="text-sm text-gray-600">
                  {profileData.leaveQuota.annualLeave.remaining}/{profileData.leaveQuota.annualLeave.total} วัน
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${(profileData.leaveQuota.annualLeave.remaining / profileData.leaveQuota.annualLeave.total) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile_m;
