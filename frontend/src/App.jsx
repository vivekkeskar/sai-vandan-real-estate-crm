import React, { useContext, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Import Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import FollowUps from './pages/FollowUps';
import Properties from './pages/Properties';
import SiteVisits from './pages/SiteVisits';
import Negotiations from './pages/Negotiations';
import Bookings from './pages/Bookings';
import Documents from './pages/Documents';
import Loans from './pages/Loans';
import Agreements from './pages/Agreements';
import Payments from './pages/Payments';
import Possession from './pages/Possession';
import CustomerSupport from './pages/CustomerSupport';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';
import Vendors from './pages/Vendors';
import Purchases from './pages/Purchases';
import VendorBills from './pages/VendorBills';
import PettyCash from './pages/PettyCash';
import Finance from './pages/Finance';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const ProtectedLayout = () => {
  const { user, loading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main-content-wrapper">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            <Route path="/customers" element={<Leads />} />
            <Route path="/followups" element={<FollowUps />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/site-visits" element={<SiteVisits />} />
            <Route path="/negotiations" element={<Negotiations />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/agreements" element={<Agreements />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/possession" element={<Possession />} />
            <Route path="/support" element={<CustomerSupport />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/vendor-bills" element={<VendorBills />} />
            <Route path="/petty-cash" element={<PettyCash />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}

export default App;
