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
  KeyIcon,
  BriefcaseIcon,
  ClockIcon
} from '@heroicons/react/outline';

const Profile = () => {
  // ========================================
  // 🔌 API: ดึงข้อมูลผู้ใช้จาก Context/API
  // ========================================
  const { user } = useAuth();
  
  // TODO: Replace with actual API call
  // const { data: profileData, isLoading } = useQuery(['profile'], fetchProfile);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Mock Data - แทนที่ด้วย API
  const [profileData, setProfileData] = useState({
    // Basic Info
    employeeId: 'EMP001',
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    email: 'somchai@company.com',
    phone: '081-234-5678',
    
    // Work Info
    position: 'Software Developer',
    department: 'IT',
    role: 'Employee', // Employee, Manager, Admin, SuperAdmin
    startDate: '2020-01-15',
    
    // Personal Info
    birthDate: '1990-05-20',
    nationalId: '1234567890123',
    address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    emergencyContact: {
      name: 'สมหญิง ใจดี',
      relation: 'คู่สมรส',
      phone: '081-999-8888'
    },
    
    // Leave Info (สำหรับ Employee)
    leaveQuota: {
      sickLeave: { used: 3, total: 30, remaining: 27 },
      businessLeave: { used: 2, total: 10, remaining: 8 },
      annualLeave: { used: 5, total: 15, remaining: 10 }
    }
  });

  const [formData, setFormData] = useState(profileData);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // ========================================
  // 📸 Handle Profile Image Upload
  // ========================================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 🔌 API: Upload image to server
      // const formData = new FormData();
      // formData.append('profileImage', file);
      // await axios.post('/api/profile/upload-image', formData);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ========================================
  // 💾 Handle Save Profile
  // ========================================
  const handleSaveProfile = async () => {
    try {
      // 🔌 API: Update profile
      // await axios.put('/api/profile', formData);
      
      setProfileData(formData);
      setIsEditing(false);
      alert('บันทึกข้อมูลเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  // ========================================
  // 🎨 Helper Functions
  // ========================================
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
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <UserCircleIcon className="h-9 w-9 text-viridian-600" />
            ข้อมูลส่วนตัว
          </h1>
          <p className="text-gray-600 mt-2">จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-viridian-600 to-viridian-700"></div>
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                  {profileImage || profileData.profileImage ? (
                    <img 
                      src={profileImage || profileData.profileImage} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
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
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Name & Position */}
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

              {/* Action Buttons */}
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserCircleIcon className="h-6 w-6 text-viridian-600" />
                ข้อมูลส่วนตัว
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อ
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    นามสกุล
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <MailIcon className="h-4 w-4" />
                    อีเมล
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <PhoneIcon className="h-4 w-4" />
                    เบอร์โทรศัพท์
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.phone}</p>
                  )}
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    วันเกิด
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {new Date(profileData.birthDate).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>

                {/* National ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <IdentificationIcon className="h-4 w-4" />
                    เลขบัตรประชาชน
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.nationalId}
                      onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
                      maxLength="13"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.nationalId}</p>
                  )}
                </div>

                {/* Address - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <LocationMarkerIcon className="h-4 w-4" />
                    ที่อยู่
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BriefcaseIcon className="h-6 w-6 text-viridian-600" />
                ข้อมูลการทำงาน
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ตำแหน่ง
                  </label>
                  <p className="text-gray-900 font-medium">{profileData.position}</p>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <OfficeBuildingIcon className="h-4 w-4" />
                    แผนก
                  </label>
                  <p className="text-gray-900 font-medium">{profileData.department}</p>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    วันที่เริ่มงาน
                  </label>
                  <p className="text-gray-900 font-medium">
                    {new Date(profileData.startDate).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Work Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    อายุงาน
                  </label>
                  <p className="text-gray-900 font-medium">
                    {calculateWorkDuration(profileData.startDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PhoneIcon className="h-6 w-6 text-red-600" />
                ผู้ติดต่อฉุกเฉิน
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Contact Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อผู้ติดต่อ
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.emergencyContact.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: {...formData.emergencyContact, name: e.target.value}
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.emergencyContact.name}</p>
                  )}
                </div>

                {/* Relation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ความสัมพันธ์
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.emergencyContact.relation}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: {...formData.emergencyContact, relation: e.target.value}
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.emergencyContact.relation}</p>
                  )}
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เบอร์โทรศัพท์
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: {...formData.emergencyContact, phone: e.target.value}
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.emergencyContact.phone}</p>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Settings & Leave Info */}
          <div className="space-y-6">
            
            {/* Leave Quota - Show only for Employees */}
            {(profileData.role === 'Employee' || profileData.role === 'Manager') && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  สิทธิ์การลา
                </h3>

                <div className="space-y-4">
                  {/* Sick Leave */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">ลาป่วย</span>
                      <span className="text-sm text-gray-600">
                        {profileData.leaveQuota.sickLeave.remaining}/{profileData.leaveQuota.sickLeave.total} วัน
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${(profileData.leaveQuota.sickLeave.remaining / profileData.leaveQuota.sickLeave.total) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Business Leave */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">ลากิจ</span>
                      <span className="text-sm text-gray-600">
                        {profileData.leaveQuota.businessLeave.remaining}/{profileData.leaveQuota.businessLeave.total} วัน
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${(profileData.leaveQuota.businessLeave.remaining / profileData.leaveQuota.businessLeave.total) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                                  {/* Annual Leave */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">ลาพักร้อน</span>
                      <span className="text-sm text-gray-600">
                        {profileData.leaveQuota.annualLeave.remaining}/{profileData.leaveQuota.annualLeave.total} วัน
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(profileData.leaveQuota.annualLeave.remaining / profileData.leaveQuota.annualLeave.total) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
