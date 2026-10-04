import React, { useState, useEffect } from 'react';
import { CalendarCheck, Plus, Car, User, Clock, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const SiteVisits = () => {
  const [visits, setVisits] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    visitDate: new Date().toISOString().split('T')[0],
    visitTime: '11:30 AM',
    pickupRequired: false,
    executive: 'Rajesh Sharma',
    propertyUnit: 'A-101',
    feedback: '',
    status: 'Scheduled'
  });

  const fetchVisits = async () => {
    try {
      const data = await api.get('/site-visits');
      setVisits(data);
      const leadsData = await api.get('/leads');
      setLeads(leadsData);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/site-visits', formData);
      addToast('Site visit scheduled successfully', 'success');
      setIsModalOpen(false);
      fetchVisits();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/site-visits/${id}`, { status });
      addToast(`Site visit status updated to ${status}`, 'success');
      fetchVisits();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Site Visit Management</h1>
          <p className="page-subtitle">Schedule prospect site visits, pickup arrangements, and customer feedback</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Schedule Site Visit
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><div className="loading-spinner"></div></div>
        ) : visits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚘</div>
            <h3>No Site Visits Scheduled</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Mobile</th>
                <th>Visit Date & Time</th>
                <th>Target Unit</th>
                <th>Pickup Required</th>
                <th>Executive</th>
                <th>Feedback</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visits.map(v => (
                <tr key={v._id}>
                  <td style={{ fontWeight: '700' }}>{v.customerName}</td>
                  <td>{v.mobile}</td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{new Date(v.visitDate).toLocaleDateString()}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{v.visitTime}</div>
                  </td>
                  <td><span className="badge badge-purple">{v.propertyUnit}</span></td>
                  <td>
                    {v.pickupRequired ? (
                      <span className="badge badge-info" style={{ gap: '4px' }}><Car size={12} /> Yes (Pickup)</span>
                    ) : (
                      <span className="badge badge-secondary">Self Visit</span>
                    )}
                  </td>
                  <td>{v.executive}</td>
                  <td style={{ maxWidth: '180px' }}>{v.feedback || 'Pending feedback'}</td>
                  <td>
                    <span className={`badge ${
                      v.status === 'Visited' ? 'badge-success' :
                      v.status === 'Scheduled' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {v.status === 'Scheduled' && (
                      <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(v._id, 'Visited')}>
                        Mark Visited
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Schedule Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Site Visit">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input type="text" className="form-input" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input type="text" className="form-input" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Visit Date *</label>
              <input type="date" className="form-input" value={formData.visitDate} onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Visit Time</label>
              <input type="text" className="form-input" value={formData.visitTime} onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Target Unit / Flat</label>
              <input type="text" className="form-input" value={formData.propertyUnit} onChange={(e) => setFormData({ ...formData, propertyUnit: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Pickup Required?</label>
              <select className="form-select" value={formData.pickupRequired ? 'Yes' : 'No'} onChange={(e) => setFormData({ ...formData, pickupRequired: e.target.value === 'Yes' })}>
                <option value="No">No (Client Self Drive)</option>
                <option value="Yes">Yes (Arrange Company Car)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Executive Name</label>
            <input type="text" className="form-input" value={formData.executive} onChange={(e) => setFormData({ ...formData, executive: e.target.value })} />
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Schedule Visit</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default SiteVisits;
