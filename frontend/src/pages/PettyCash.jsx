import React, { useState, useEffect } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const PettyCash = () => {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({ openingBalance: 50000, totalReceived: 0, totalSpent: 0, closingBalance: 50000 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useNotification();

  const categories = [
    'Office Expenses', 'Tea & Snacks', 'Fuel', 'Vehicle Maintenance', 
    'Courier', 'Stationery', 'Electricity', 'Internet', 'Marketing', 
    'Site Expenses', 'Labour Payment', 'Miscellaneous', 'Cash Refill'
  ];

  const [formData, setFormData] = useState({
    type: 'Expense',
    category: 'Tea & Snacks',
    description: 'Refreshments for site visitors and team',
    employeeName: 'Rajesh Sharma',
    amount: 1500,
    paymentMode: 'Cash',
    approvedBy: 'Manager'
  });

  const fetchPettyCash = async () => {
    try {
      const res = await api.get('/petty-cash');
      setEntries(res.entries || []);
      if (res.summary) setSummary(res.summary);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPettyCash();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/petty-cash', formData);
      addToast('Petty cash voucher entry recorded', 'success');
      setIsModalOpen(false);
      fetchPettyCash();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Petty Cash & Daily Cash Book</h1>
          <p className="page-subtitle">Site expenses, tea & snacks, fuel, courier & office cash ledger</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Cash Voucher Entry
        </button>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card">
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Opening Cash Fund</span>
          <h3 style={{ fontSize: '22px', fontWeight: '800', marginTop: '4px' }}>₹{summary.openingBalance?.toLocaleString()}</h3>
        </div>
        <div className="card" style={{ background: '#ECFDF5', borderColor: '#A7F3D0' }}>
          <span style={{ fontSize: '13px', color: '#047857', fontWeight: '600' }}>Cash Received (Refills)</span>
          <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#065F46', marginTop: '4px' }}>+₹{summary.totalReceived?.toLocaleString()}</h3>
        </div>
        <div className="card" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
          <span style={{ fontSize: '13px', color: '#B91C1C', fontWeight: '600' }}>Total Cash Spent</span>
          <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#991B1B', marginTop: '4px' }}>-₹{summary.totalSpent?.toLocaleString()}</h3>
        </div>
        <div className="card" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
          <span style={{ fontSize: '13px', color: '#1E40AF', fontWeight: '600' }}>Closing Cash Balance</span>
          <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1E3A8A', marginTop: '4px' }}>₹{summary.closingBalance?.toLocaleString()}</h3>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><div className="loading-spinner"></div></div>
        ) : entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👛</div>
            <h3>No Cash Vouchers Logged</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Voucher #</th>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Employee</th>
                <th>Amount (INR)</th>
                <th>Mode</th>
                <th>Approved By</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e._id}>
                  <td style={{ fontWeight: '800', color: 'var(--primary)' }}>{e.voucherNumber}</td>
                  <td>{new Date(e.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${e.type === 'Received' ? 'badge-success' : 'badge-danger'}`}>
                      {e.type}
                    </span>
                  </td>
                  <td><span className="badge badge-purple">{e.category}</span></td>
                  <td>{e.description}</td>
                  <td>{e.employeeName}</td>
                  <td style={{ fontWeight: '800', color: e.type === 'Received' ? 'var(--success)' : 'var(--danger)' }}>
                    {e.type === 'Received' ? '+' : '-'}₹{e.amount?.toLocaleString()}
                  </td>
                  <td>{e.paymentMode}</td>
                  <td>{e.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Petty Cash Voucher">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Transaction Type</label>
              <select className="form-select" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="Expense">Cash Expense (Outflow)</option>
                <option value="Received">Cash Received / Refill (Inflow)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-select" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (INR) *</label>
              <input type="number" className="form-input" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Employee Name *</label>
              <input type="text" className="form-input" value={formData.employeeName} onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Expense Description *</label>
            <textarea className="form-textarea" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required></textarea>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Voucher</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default PettyCash;
