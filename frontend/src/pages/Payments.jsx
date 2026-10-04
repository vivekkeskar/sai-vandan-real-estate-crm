import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    customerName: 'Mrs. Snehal Kulkarni',
    unitNumber: 'A-101',
    paymentType: 'Agreement Payment',
    amount: 1500000,
    paymentDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    paymentMode: 'Bank Transfer',
    transactionNumber: 'NEFT-99812903',
    status: 'Paid',
    remarks: ''
  });

  const fetchPayments = async () => {
    try {
      const data = await api.get('/payments');
      setPayments(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payments', formData);
      addToast('Customer payment entry recorded successfully', 'success');
      setIsModalOpen(false);
      fetchPayments();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const totalCollected = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status !== 'Paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Payment Tracking & Receivables</h1>
          <p className="page-subtitle">Milestone slab collections, booking tokens & overdue alerts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Record Customer Payment
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ background: '#ECFDF5', borderColor: '#A7F3D0' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#047857' }}>Total Collected Revenue</span>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#065F46', marginTop: '4px' }}>₹{(totalCollected / 100000).toFixed(2)} Lakhs</h2>
        </div>
        <div className="card" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#B91C1C' }}>Pending Customer Dues</span>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#991B1B', marginTop: '4px' }}>₹{(totalPending / 100000).toFixed(2)} Lakhs</h2>
        </div>
        <div className="card" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E40AF' }}>Total Customer Installments</span>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1E3A8A', marginTop: '4px' }}>{payments.length} Transactions</h2>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><div className="loading-spinner"></div></div>
        ) : payments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💳</div>
            <h3>No Payment Transactions Found</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Unit Number</th>
                <th>Milestone / Type</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Due Date</th>
                <th>Payment Mode</th>
                <th>Transaction #</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p._id} style={{ backgroundColor: p.status === 'Overdue' ? '#FEF2F2' : 'transparent' }}>
                  <td style={{ fontWeight: '700' }}>{p.customerName}</td>
                  <td><span className="badge badge-purple">{p.unitNumber}</span></td>
                  <td style={{ fontWeight: '600' }}>{p.paymentType}</td>
                  <td style={{ fontWeight: '800', color: 'var(--primary)' }}>₹{(p.amount / 100000).toFixed(2)}L</td>
                  <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                  <td>{new Date(p.dueDate).toLocaleDateString()}</td>
                  <td><span className="badge badge-secondary">{p.paymentMode}</span></td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.transactionNumber || '-'}</td>
                  <td>
                    <span className={`badge ${
                      p.status === 'Paid' ? 'badge-success' :
                      p.status === 'Overdue' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Customer Payment">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input type="text" className="form-input" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Number *</label>
              <input type="text" className="form-input" value={formData.unitNumber} onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Milestone Type *</label>
              <select className="form-select" value={formData.paymentType} onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}>
                <option value="Booking Amount">Booking Amount</option>
                <option value="Agreement Payment">Agreement Payment</option>
                <option value="Slab Payment">Slab Payment</option>
                <option value="Final Payment">Final Payment</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Amount (INR) *</label>
              <input type="number" className="form-input" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select className="form-select" value={formData.paymentMode} onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}>
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Transaction / UTR Number</label>
              <input type="text" className="form-input" value={formData.transactionNumber} onChange={(e) => setFormData({ ...formData, transactionNumber: e.target.value })} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Date *</label>
              <input type="date" className="form-input" value={formData.paymentDate} onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Status</label>
              <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Payment Record</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Payments;
