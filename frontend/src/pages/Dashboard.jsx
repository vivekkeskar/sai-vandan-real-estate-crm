import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, CalendarCheck, BookOpenCheck, IndianRupee, AlertCircle, 
  Truck, Banknote, Wallet, Building2, TrendingUp, ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts';
import StatCard from '../components/StatCard';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const stats = await api.get('/dashboard/stats');
      setData(stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading Executive Dashboard...</p>
      </div>
    );
  }

  const { cards, charts, feeds } = data || {};

  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1'];

  return (
    <div className="page-container">
      {/* Top Welcome Banner */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">Sai Vandan Complex • Operational & Financial Real-Time Overview</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchDashboardData} className="btn btn-secondary">
            Refresh Data
          </button>
          <Link to="/leads" className="btn btn-primary">
            + New Enquiry
          </Link>
        </div>
      </div>

      {/* 11 Dynamic Summary Metric Cards Grid */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <StatCard title="Total Leads" value={cards?.totalLeads || 0} icon={Users} color="#2563EB" bg="#EFF6FF" subtitle="All enquiries" />
        <StatCard title="New Leads" value={cards?.newLeads || 0} icon={Users} color="#8B5CF6" bg="#F5F3FF" subtitle="Uncontacted" />
        <StatCard title="Qualified Leads" value={cards?.qualifiedLeads || 0} icon={UserCheck} color="#10B981" bg="#ECFDF5" subtitle="High intent buyers" />
        <StatCard title="Follow-ups Today" value={cards?.followUpsToday || 0} icon={CalendarCheck} color="#F59E0B" bg="#FFFBEB" subtitle="Action items" />
        <StatCard title="Site Visits" value={cards?.siteVisitsCount || 0} icon={Building2} color="#3B82F6" bg="#EFF6FF" subtitle="Scheduled & Visited" />
        <StatCard title="Confirmed Bookings" value={cards?.bookingsCount || 0} icon={BookOpenCheck} color="#10B981" bg="#ECFDF5" subtitle="Units Sold" />
        <StatCard title="Total Sales Volume" value={`₹${((cards?.totalSales || 0) / 100000).toFixed(2)} L`} icon={IndianRupee} color="#10B981" bg="#ECFDF5" subtitle="Booking Value" />
        <StatCard title="Pending Receivables" value={`₹${((cards?.pendingCustomerPayments || 0) / 100000).toFixed(2)} L`} icon={AlertCircle} color="#EF4444" bg="#FEF2F2" subtitle="Customer Due" />
        <StatCard title="Vendor Outstanding" value={`₹${((cards?.vendorOutstanding || 0) / 100000).toFixed(2)} L`} icon={Truck} color="#F59E0B" bg="#FFFBEB" subtitle="Unpaid Bills" />
        <StatCard title="Employee Payroll" value={`₹${(cards?.employeeSalaryTotal || 0).toLocaleString()}`} icon={Banknote} color="#6366F1" bg="#EEF2FF" subtitle="Monthly Salary" />
        <StatCard title="Petty Cash Balance" value={`₹${(cards?.pettyCashBalance || 0).toLocaleString()}`} icon={Wallet} color="#10B981" bg="#ECFDF5" subtitle="Site Cash Fund" />
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        
        {/* Monthly Sales Trend */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--primary)" /> Monthly Sales Trend (INR)
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.monthlySalesChart || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(val) => `₹${(val / 100000)}L`} />
                <Tooltip formatter={(value) => [`₹${(value / 100000).toFixed(2)} Lakhs`, 'Sales']} />
                <Line type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Availability Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Property Inventory Availability</h3>
          <div style={{ width: '100%', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.propertyAvailability || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts?.propertyAvailability || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '13px', fontWeight: '600' }}>
            {(charts?.propertyAvailability || []).map(p => (
              <span key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: p.color }}></span>
                {p.name}: {p.value} units
              </span>
            ))}
          </div>
        </div>

        {/* Leads by Source */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Leads by Channel / Source</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.leadsBySource || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Booking Status Pipeline</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.bookingStatusChart || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" stroke="#64748B" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Actionable Feeds Section */}
      <div className="grid-2">
        {/* Recent Leads Feed */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Recent Lead Enquiries</h3>
            <Link to="/leads" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Config</th>
                  <th>Budget</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(feeds?.recentLeads || []).map(lead => (
                  <tr key={lead._id}>
                    <td>
                      <div style={{ fontWeight: '700' }}>{lead.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lead.mobile}</div>
                    </td>
                    <td>{lead.configuration}</td>
                    <td>₹{(lead.budget / 100000).toFixed(1)}L</td>
                    <td>
                      <span className={`badge ${lead.status === 'Converted' ? 'badge-success' : 'badge-info'}`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Follow-ups Feed */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Upcoming Follow-ups</h3>
            <Link to="/site-visits" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Lead / Contact</th>
                  <th>Channel</th>
                  <th>Remarks</th>
                  <th>Executive</th>
                </tr>
              </thead>
              <tbody>
                {(feeds?.upcomingFollowUps || []).map(f => (
                  <tr key={f._id}>
                    <td>
                      <div style={{ fontWeight: '700' }}>{f.leadId?.name || 'Customer'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{f.leadId?.mobile}</div>
                    </td>
                    <td><span className="badge badge-purple">{f.type}</span></td>
                    <td style={{ maxWidth: '180px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{f.remarks}</td>
                    <td>{f.executiveName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
