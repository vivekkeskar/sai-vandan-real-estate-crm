import React, { useState, useEffect } from 'react';
import { FileCheck, Plus } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const Agreements = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    customerName: '',
    unitNumber: 'A-101',
    agreementDate: new Date().toISOString().split('T')[0],
    agreementAmount: 6500000,
    stampDuty: 455000,
    registrationNumber: 'PN-2026-99182',
    status: 'Agreement Completed',
    remarks: ''
  });

  const fetchAgreements = async () => {
    try {
      const data = await api.get('/agreements');
      setAgreements(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/agreements', formData);
      addToast('Agreement record created successfully', 'success');
      setIsModalOpen(false);
      fetchAgreements();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Agreement & Stamp Duty Registration</h1>
          <p className="page-subtitle">Sub-registrar office registration tracker & stamp duty calculations</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Record Agreement
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><div className="loading-spinner"></div></div>
        ) : agreements.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📜</div>
            <h3>No Agreement Records Found</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Unit Number</th>
                <th>Agreement Date</th>
                <th>Agreement Amount</th>
                <th>Stamp Duty Paid</th>
                <th>Sub-Registrar Doc #</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {agreements.map(a => (
                <tr key={a._id}>
                  <td style={{ fontWeight: '700' }}>{a.customerName}</td>
                  <td><span className="badge badge-purple">{a.unitNumber}</span></td>
                  <td>{new Date(a.agreementDate).toLocaleDateString()}</td>
                  <td style={{ fontWeight: '700' }}>₹{(a.agreementAmount / 100000).toFixed(2)}L</td>
                  <td style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{a.stampDuty?.toLocaleString()}</td>
                  <td style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{a.registrationNumber || 'Pending'}</td>
                  <td>
                    <span className={`badge ${
                      a.status === 'Registered' || a.status === 'Agreement Completed' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Sales Agreement">
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
              <label className="form-label">Agreement Date *</label>
              <input type="date" className="form-input" value={formData.agreementDate} onChange={(e) => setFormData({ ...formData, agreementDate: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Agreement Value (INR) *</label>
              <input type="number" className="form-input" value={formData.agreementAmount} onChange={(e) => {
                const amt = Number(e.target.value);
                setFormData({ ...formData, agreementAmount: amt, stampDuty: Math.round(amt * 0.07) });
              }} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Stamp Duty (7% Auto) *</label>
              <input type="number" className="form-input" value={formData.stampDuty} onChange={(e) => setFormData({ ...formData, stampDuty: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Registration Number</label>
              <input type="text" className="form-input" placeholder="PN-2026-XXXX" value={formData.registrationNumber} onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="Agreement Completed">Agreement Completed</option>
              <option value="Registered">Registered</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Agreement</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Agreements;
