import React, { useState, useEffect } from 'react';
import { Headset, Plus, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const CustomerSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    customerName: 'Mrs. Snehal Kulkarni',
    mobile: '+91 98220 11223',
    unitNumber: 'A-101',
    requestType: 'Documentation',
    description: 'Request copy of Index II and registered agreement copy',
    assignedEmployee: 'Pooja Kulkarni',
    priority: 'Medium',
    status: 'Open'
  });

  const fetchTickets = async () => {
    try {
      const data = await api.get('/support');
      setTickets(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/support', formData);
      addToast('Customer support ticket logged', 'success');
      setIsModalOpen(false);
      fetchTickets();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/support/${id}`, { status, resolvedDate: status === 'Resolved' ? new Date() : null });
      addToast(`Ticket status updated to ${status}`, 'success');
      fetchTickets();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">After-Sales Customer Support</h1>
          <p className="page-subtitle">Helpdesk tickets, maintenance requests & customer complaints</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Log Support Ticket
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><div className="loading-spinner"></div></div>
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎧</div>
            <h3>No Customer Support Tickets Open</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Unit Number</th>
                <th>Request Type</th>
                <th>Issue Description</th>
                <th>Assigned Executive</th>
                <th>Priority</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t._id}>
                  <td style={{ fontWeight: '700' }}>{t.customerName}</td>
                  <td><span className="badge badge-purple">{t.unitNumber}</span></td>
                  <td><span className="badge badge-secondary">{t.requestType}</span></td>
                  <td style={{ maxWidth: '240px' }}>{t.description}</td>
                  <td>{t.assignedEmployee}</td>
                  <td>
                    <span className={`badge ${
                      t.priority === 'Urgent' || t.priority === 'High' ? 'badge-danger' : 'badge-info'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      t.status === 'Resolved' || t.status === 'Closed' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {t.status !== 'Resolved' && (
                      <button className="btn btn-success btn-sm" onClick={() => handleStatusUpdate(t._id, 'Resolved')}>
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Customer Support Ticket">
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
              <label className="form-label">Request Type *</label>
              <select className="form-select" value={formData.requestType} onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}>
                <option value="Maintenance">Maintenance</option>
                <option value="Complaint">Complaint</option>
                <option value="Service Request">Service Request</option>
                <option value="Documentation">Documentation</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <select className="form-select" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea className="form-textarea" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required></textarea>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Log Ticket</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default CustomerSupport;
