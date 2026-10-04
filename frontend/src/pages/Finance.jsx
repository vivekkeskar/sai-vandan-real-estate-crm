import React, { useState, useEffect } from 'react';
import { 
  PieChart, DollarSign, ArrowUpRight, ArrowDownLeft, Wallet, 
  CreditCard, Banknote, Truck, TrendingUp, Building 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart as RePieChart, Pie, Cell, CartesianGrid 
} from 'recharts';
import StatCard from '../components/StatCard';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Finance = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotification();

  const fetchFinanceStats = async () => {
    try {
      const data = await api.get('/dashboard/finance-stats');
      setStats(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceStats();
  }, []);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Calculating Financial Ledgers & DB Metrics...</p>
      </div>
    );
  }

  const { 
    customerReceivables, employeeSalaryPayments, vendorOutstanding, 
    pettyCashBalance, dailyCollection, dailyExpenses, bankBalance, profitAndLoss 
  } = stats || {};

  const pnlData = [
    { name: 'Total Collection Revenue', amount: profitAndLoss?.totalRevenue || 0, fill: '#10B981' },
    { name: 'Total Project Expenses', amount: profitAndLoss?.totalExpenses || 0, fill: '#EF4444' }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Accounts & Finance Dashboard</h1>
          <p className="page-subtitle">Sai Vandan Complex • Revenue Collections, Cash Flows & Profit & Loss Ledger</p>
        </div>
        <button onClick={fetchFinanceStats} className="btn btn-secondary">
          Refresh Ledger Data
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <StatCard title="Customer Receivables" value={`₹${((customerReceivables || 0) / 100000).toFixed(2)} L`} icon={CreditCard} color="#2563EB" bg="#EFF6FF" subtitle="Due from flat buyers" />
        <StatCard title="Vendor Outstanding" value={`₹${((vendorOutstanding || 0) / 100000).toFixed(2)} L`} icon={Truck} color="#F59E0B" bg="#FFFBEB" subtitle="Unpaid contractor bills" />
        <StatCard title="Salary Disbursement" value={`₹${(employeeSalaryPayments || 0).toLocaleString()}`} icon={Banknote} color="#8B5CF6" bg="#F5F3FF" subtitle="Monthly payroll paid" />
        <StatCard title="Petty Cash Balance" value={`₹${(pettyCashBalance || 0).toLocaleString()}`} icon={Wallet} color="#10B981" bg="#ECFDF5" subtitle="Site liquid cash" />
      </div>

      {/* Second Row Cards */}
      <div className="grid-3" style={{ marginBottom: '28px' }}>
        <div className="card" style={{ background: '#ECFDF5', borderColor: '#A7F3D0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContext: 'space-between', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: '#10B981', color: '#FFF' }}>
              <ArrowUpRight size={22} />
            </div>
            <div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#047857' }}>Total Collection Revenue</span>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#065F46', marginTop: '2px' }}>₹{((dailyCollection || 0) / 100000).toFixed(2)} Lakhs</h3>
            </div>
          </div>
        </div>

        <div className="card" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContext: 'space-between', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: '#EF4444', color: '#FFF' }}>
              <ArrowDownLeft size={22} />
            </div>
            <div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#B91C1C' }}>Total Project Outflows</span>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#991B1B', marginTop: '2px' }}>₹{((dailyExpenses || 0) / 100000).toFixed(2)} Lakhs</h3>
            </div>
          </div>
        </div>

        <div className="card" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContext: 'space-between', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: '#2563EB', color: '#FFF' }}>
              <Building size={22} />
            </div>
            <div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E40AF' }}>Estimated Liquidity / Bank Balance</span>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1E3A8A', marginTop: '2px' }}>₹{((bankBalance || 0) / 100000).toFixed(2)} Lakhs</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Profit & Loss Section */}
      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--primary)" /> Profit & Loss Breakdown (INR)
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pnlData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `₹${(v / 100000)}L`} />
                <Tooltip formatter={(value) => [`₹${(value / 100000).toFixed(2)} Lakhs`, 'Amount']} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {pnlData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* P&L Net Summary Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)' }}>
            Net Financial Operating Position
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Customer Token & Milestone Collections</span>
              <strong style={{ color: 'var(--success)' }}>+₹{(profitAndLoss?.totalRevenue || 0).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Vendor Payments & Payroll Costs</span>
              <strong style={{ color: 'var(--danger)' }}>-₹{(profitAndLoss?.totalExpenses || 0).toLocaleString()}</strong>
            </div>
            <div style={{ 
              display: 'flex', 
              justify: 'space-between', 
              padding: '14px', 
              background: profitAndLoss?.netProfit >= 0 ? '#ECFDF5' : '#FEF2F2',
              borderRadius: '8px',
              marginTop: '12px' 
            }}>
              <span style={{ fontWeight: '700', color: profitAndLoss?.netProfit >= 0 ? '#047857' : '#B91C1C' }}>
                NET OPERATING SURPLUS / PROFIT
              </span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: profitAndLoss?.netProfit >= 0 ? '#065F46' : '#991B1B' }}>
                ₹{(profitAndLoss?.netProfit || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Finance;
