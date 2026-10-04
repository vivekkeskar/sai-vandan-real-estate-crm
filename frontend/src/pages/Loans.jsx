import React, { useState, useEffect } from 'react';
import { Landmark, Plus, CheckCircle, Clock } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    customerName: 'Mrs. Snehal Kulkarni',
    bookingId: '',
    unitNumber: 'A-101',
    bankName: 'HDFC Bank',
    loanAmount: 5000000,
    emi: 48500,
    applicationDate: new Date().toISOString().split('T')[0],
    sanctionDate: '',
    status: 'Loan Applied',
    remarks: ''
  });

  const fetchLoans = async () => {
    try {
      const data = await api.get('/loans');
      setLoans(data);
      const bData = await api.get('/bookings');
      setBookings(bData);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/loans', formData);
      addToast('Loan application record added', 'success');
      setIsModalOpen(false);
      fetchLoans();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bank Loan Processing</h1>
          <p className="page-subtitle">Track home loan approvals, bank verification & disbursement status</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Record Loan Application
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><div className="loading-spinner"></div></div>
        ) : loans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏦</div>
            <h3>No Loan Applications Tracked</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Unit Number</th>
                <th>Bank Partner</th>
                <th>Sanctioned Amount</th>
                <th>Est. Monthly EMI</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {loans.map(l => (
                <tr key={l._id}>
                  <td style={{ fontWeight: '700' }}>{l.customerName}</td>
                  <td><span className="badge badge-purple">{l.unitNumber}</span></td>
                  <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{l.bankName}</td>
                  <td style={{ fontWeight: '800' }}>₹{(l.loanAmount / 100000).toFixed(2)} Lakhs</td>
                  <td>₹{l.emi?.toLocaleString()}/mo</td>
                  <td>{new Date(l.applicationDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${
                      l.status === 'Disbursed' || l.status === 'Approved' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td>{l.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Home Loan Application">
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
              <label className="form-label">Bank Name *</label>
              <input type="text" className="form-input" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Requested Loan Amount (INR) *</label>
              <input type="number" className="form-input" value={formData.loanAmount} onChange={(e) => setFormData({ ...formData, loanAmount: Number(e.target.value) })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Est. EMI (INR)</label>
              <input type="number" className="form-input" value={formData.emi} onChange={(e) => setFormData({ ...formData, emi: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Pipeline Status</label>
              <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="Loan Applied">Loan Applied</option>
                <option value="Bank Verification">Bank Verification</option>
                <option value="Approved">Approved</option>
                <option value="Disbursed">Disbursed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Loan Record</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Loans;
