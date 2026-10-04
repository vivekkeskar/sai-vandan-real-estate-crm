import React, { useState } from 'react';
import { Settings as SettingsIcon, Building, ShieldCheck, Database, RefreshCw, Check } from 'lucide-react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Settings = () => {
  const [seeding, setSeeding] = useState(false);
  const { addToast } = useNotification();

  const handleReSeed = async () => {
    if (window.confirm('Re-seeding will restore all sample demo data for Sai Vandan Complex. Continue?')) {
      setSeeding(true);
      try {
        await api.post('/seed', {});
        addToast('Database successfully re-seeded with sample leads, properties, and finance entries!', 'success');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        addToast(err.message, 'error');
      } finally {
        setSeeding(false);
      }
    }
  };

  const roleMatrix = [
    { module: 'Dashboard', admin: true, sales: true, hr: true, accounts: true, manager: true, emp: true },
    { module: 'Leads & Qualification', admin: true, sales: true, hr: false, accounts: false, manager: true, emp: false },
    { module: 'Properties & Inventory', admin: true, sales: true, hr: false, accounts: true, manager: true, emp: false },
    { module: 'Follow-ups & Site Visits', admin: true, sales: true, hr: false, accounts: false, manager: true, emp: false },
    { module: 'Bookings & Agreements', admin: true, sales: true, hr: false, accounts: true, manager: true, emp: false },
    { module: 'Customer Payments', admin: true, sales: false, hr: false, accounts: true, manager: true, emp: false },
    { module: 'Employee Directory', admin: true, sales: false, hr: true, accounts: false, manager: true, emp: false },
    { module: 'Attendance & Payroll', admin: true, sales: false, hr: true, accounts: true, manager: true, emp: false },
    { module: 'Vendor Bills & Petty Cash', admin: true, sales: false, hr: false, accounts: true, manager: true, emp: false },
    { module: 'Finance & Reports', admin: true, sales: true, hr: true, accounts: true, manager: true, emp: false }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings & Project Profile</h1>
          <p className="page-subtitle">Project configuration for Sai Vandan Complex • Mrs. Snehal Kulkarni</p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Project Profile Card */}
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={20} color="var(--primary)" /> Project Master Profile
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <div><span style={{ color: 'var(--text-muted)' }}>Project Name:</span> <strong style={{ color: 'var(--primary)' }}>SAI VANDAN COMPLEX</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Client Name:</span> <strong>Mrs. Snehal Kulkarni</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Location:</span> <strong>Baner Road, Pune, Maharashtra 411045</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Inventory Span:</span> <strong>3 Wings (A Wing, B Wing, C Wing) • 1-4 BHK Flats</strong></div>
            <div><span style={{ color: 'var(--text-muted)' }}>Architecture:</span> <strong>MERN Stack • REST APIs • MongoDB Engine</strong></div>
          </div>
        </div>

        {/* Database Management Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} color="var(--success)" /> Master Seed & Database Reset
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Restore complete pre-populated sample dataset for Mrs. Snehal Kulkarni's project including sample leads, bookings, payments, staff directory & vendor bills.
            </p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button onClick={handleReSeed} disabled={seeding} className="btn btn-primary" style={{ gap: '8px' }}>
              <RefreshCw size={16} className={seeding ? 'spin' : ''} /> {seeding ? 'Seeding MongoDB...' : 'Re-Seed Sai Vandan Demo Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Role Permission Matrix Table */}
      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="var(--purple)" /> Role-Based Access Control (RBAC) Matrix
        </h3>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>CRM Module / Feature</th>
                <th>Admin</th>
                <th>Sales Executive</th>
                <th>HR</th>
                <th>Accounts</th>
                <th>Manager</th>
                <th>Employee</th>
              </tr>
            </thead>
            <tbody>
              {roleMatrix.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: '700' }}>{r.module}</td>
                  <td>{r.admin ? <Check size={16} color="var(--success)" /> : '-'}</td>
                  <td>{r.sales ? <Check size={16} color="var(--success)" /> : '-'}</td>
                  <td>{r.hr ? <Check size={16} color="var(--success)" /> : '-'}</td>
                  <td>{r.accounts ? <Check size={16} color="var(--success)" /> : '-'}</td>
                  <td>{r.manager ? <Check size={16} color="var(--success)" /> : '-'}</td>
                  <td>{r.emp ? <Check size={16} color="var(--success)" /> : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Settings;
