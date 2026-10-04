import React, { useState, useEffect } from 'react';
import { Tag, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const Negotiations = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    customerName: '',
    unitNumber: 'A-201',
    originalPrice: 9500000,
    offeredPrice: 9200000,
    discount: 300000,
    specialOffer: 'Free Modular Kitchen & Covered Parking',
    finalPrice: 9200000,
    approvalStatus: 'Pending',
    remarks: ''
  });

  const fetchItems = async () => {
    try {
      const data = await api.get('/negotiations');
      setItems(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/negotiations', formData);
      addToast('Price negotiation request submitted for Manager approval', 'success');
      setIsModalOpen(false);
      fetchItems();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleApproval = async (id, status) => {
    try {
      await api.put(`/negotiations/${id}`, { approvalStatus: status });
      addToast(`Negotiation offer ${status.toLowerCase()}`, 'success');
      fetchItems();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Price Negotiations & Discounts</h1>
          <p className="page-subtitle">Track custom pricing offers, special packages, and management approvals</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Offer / Negotiation
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><div className="loading-spinner"></div></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏷️</div>
            <h3>No Price Negotiations Found</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Target Unit</th>
                <th>Original Price</th>
                <th>Offered Price</th>
                <th>Discount</th>
                <th>Special Inclusions</th>
                <th>Approval Status</th>
                <th style={{ textAlign: 'right' }}>Management Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  <td style={{ fontWeight: '700' }}>{item.customerName}</td>
                  <td><span className="badge badge-purple">{item.unitNumber}</span></td>
                  <td>₹{(item.originalPrice / 100000).toFixed(2)}L</td>
                  <td style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{(item.offeredPrice / 100000).toFixed(2)}L</td>
                  <td style={{ color: 'var(--danger)', fontWeight: '600' }}>-₹{(item.discount / 100000).toFixed(2)}L</td>
                  <td style={{ maxWidth: '200px', fontSize: '12px' }}>{item.specialOffer || 'Standard'}</td>
                  <td>
                    <span className={`badge ${
                      item.approvalStatus === 'Approved' ? 'badge-success' :
                      item.approvalStatus === 'Pending' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {item.approvalStatus}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {item.approvalStatus === 'Pending' && (
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button className="btn btn-success btn-sm" onClick={() => handleApproval(item._id, 'Approved')}>Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleApproval(item._id, 'Rejected')}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Price Negotiation Request">
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
              <label className="form-label">Original List Price (INR) *</label>
              <input type="number" className="form-input" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Offered Special Price (INR) *</label>
              <input type="number" className="form-input" value={formData.offeredPrice} onChange={(e) => {
                const off = Number(e.target.value);
                const disc = Math.max(0, formData.originalPrice - off);
                setFormData({ ...formData, offeredPrice: off, discount: disc, finalPrice: off });
              }} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Special Offer Package</label>
            <input type="text" className="form-input" value={formData.specialOffer} onChange={(e) => setFormData({ ...formData, specialOffer: e.target.value })} />
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Submit Negotiation</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Negotiations;
