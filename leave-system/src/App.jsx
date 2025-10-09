import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// ✅ ลอง log ดูว่า import ได้หรือไม่

// Layout
import EmployeeNavbar from './components/layout/EmployeeNavbar';
import ManagerNavbar from './components/layout/ManagerNavbar';


// Common
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth
import Login from './components/auth/Login';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import LeaveHistory from './pages/employee/LeaveHistory';
import LeaveRequest from './pages/employee/LeaveRequest';


// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ApproveLeave from './pages/manager/ApproveLeave';
import TeamLeaveHistory from './pages/manager/TeamLeaveHistory';
import TeamCalendar from './pages/manager/TeamCalendar';

// Shared Pages
import Profile from './pages/shared/Profile';
import Settings from './pages/shared/Settings';

// Error Pages
import NotFound from './components/NotFound';

// Layout Wrapper Component
const LayoutWrapper = ({ children }) => {
  const { isManager } = useAuth();
  
  return (
    <>
      {isManager() ? <ManagerNavbar /> : <EmployeeNavbar />}
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ========== Public Routes ========== */}
          <Route path="/login" element={<Login />} />
          
          {/* ========== Employee Routes ========== */}
          <Route path="/employee/*" element={
            <ProtectedRoute allowedRoles={['employee', 'manager']}>
              <LayoutWrapper>
                <Routes>
                  <Route path="dashboard" element={<EmployeeDashboard />} />
                  <Route path="leave-history" element={<LeaveHistory />} />
                  <Route path="leave-request" element={<LeaveRequest />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </LayoutWrapper>
            </ProtectedRoute>
          } />
          
          {/* ========== Manager Routes ========== */}
          <Route path="/manager/*" element={
            <ProtectedRoute allowedRoles={['manager', 'admin']}>
              <LayoutWrapper>
                <Routes>
                  <Route path="dashboard" element={<ManagerDashboard />} />
                  <Route path="approve-leave" element={<ApproveLeave />} />
                  <Route path="team-leave" element={<TeamLeaveHistory />} />
                  <Route path="team-calendar" element={<TeamCalendar />} />
                  {/* หัวหน้าก็ยังลาได้ */}
                  <Route path="leave-history" element={<LeaveHistory />} />
                  <Route path="leave-request" element={<LeaveRequest />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </LayoutWrapper>
            </ProtectedRoute>
          } />
          
          {/* ========== Shared Routes ========== */}
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <LayoutWrapper>
                <Profile />
              </LayoutWrapper>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <LayoutWrapper>
                <Settings />
              </LayoutWrapper>
            </ProtectedRoute>
          } />
          
          {/* ========== Root Redirect ========== */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* ========== 404 Not Found ========== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Component สำหรับ Redirect หน้าแรก
const RootRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect ตาม Role
  if (user.role === 'manager' || user.role === 'admin') {
    return <Navigate to="/manager/dashboard" replace />;
  } else {
    return <Navigate to="/employee/dashboard" replace />;
  }
};

export default App;