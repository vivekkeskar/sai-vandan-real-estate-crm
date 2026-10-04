import React, { useState, useEffect } from 'react';
import { Calendar, Phone, MessageSquare, Mail, Video, CheckCircle, Clock, Plus, Check } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const FollowUps = () => {
  const [followUps, setFollowUps] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // All, Today, Upcoming, Overdue
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    leadId: '',
    type: 'Phone Call',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    remarks: '',
    nextFollowUpDate: '',
    executiveName: 'Rajesh Sharma',
    status: 'Pending'
  });

  const fetchFollowUps = async () => {
    try {
      const data = await api.get('/followups');
      setFollowUps(data);
      const leadsData = await api.get('/leads');
      setLeads(leadsData);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.leadId) {
      addToast('Please select a customer lead for this follow-up', 'error');
      return;
    }
    try {
      await api.post('/followups', formData);
      addToast('Follow-up scheduled successfully', 'success');
      setIsModalOpen(false);
      fetchFollowUps();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleMarkCompleted = async (f) => {
    try {
      await api.put(`/followups/${f._id}`, { status: 'Completed' });
      addToast('Follow-up marked as completed', 'success');
      fetchFollowUps();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Filter logic
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const filteredFollowUps = followUps.filter(f => {
    const fDate = new Date(f.date);
    fDate.setHours(0, 0, 0, 0);

    if (activeTab === 'Today') return fDate.getTime() === now.getTime();
    if (activeTab === 'Upcoming') return fDate.getTime() > now.getTime();
    if (activeTab === 'Overdue') return fDate.getTime() < now.getTime() && f.status === 'Pending';
    return true;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Follow-up Management</h1>
          <p className="page-subtitle">Schedule, track, and complete customer engagement calls & meetings</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Schedule Follow-up
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
        {['All', 'Today', 'Upcoming', 'Overdue'].map(tab => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} Follow-ups
          </button>
        ))}
      </div>

      {/* Follow-ups List Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : filteredFollowUps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📞</div>
            <h3>No {activeTab} Follow-ups Found</h3>
            <p>Schedule a new follow-up call or meeting to stay connected with your prospects.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer / Lead</th>
                <th>Channel</th>
                <th>Date & Time</th>
                <th>Remarks</th>
                <th>Next Follow-up</th>
                <th>Executive</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFollowUps.map(f => (
                <tr key={f._id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{f.leadId?.name || 'Customer'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{f.leadId?.mobile}</div>
                  </td>
                  <td>
                    <span className="badge badge-purple" style={{ gap: '4px' }}>
                      {f.type === 'Phone Call' && <Phone size={12} />}
                      {f.type === 'WhatsApp' && <MessageSquare size={12} />}
                      {f.type === 'Email' && <Mail size={12} />}
                      {f.type}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{new Date(f.date).toLocaleDateString()}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{f.time}</div>
                  </td>
                  <td style={{ maxWidth: '220px' }}>{f.remarks}</td>
                  <td>
                    {f.nextFollowUpDate ? new Date(f.nextFollowUpDate).toLocaleDateString() : 'None'}
                  </td>
                  <td>{f.executiveName}</td>
                  <td>
                    <span className={`badge ${f.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                      {f.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {f.status === 'Pending' && (
                      <button 
                        className="btn btn-success btn-sm" 
                        onClick={() => handleMarkCompleted(f)}
                        style={{ gap: '4px' }}
                      >
                        <Check size={14} /> Done
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Customer Follow-up"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Customer Lead *</label>
            <select
              className="form-select"
              value={formData.leadId}
              onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
              required
            >
              <option value="">-- Choose Lead --</option>
              {leads.map(l => (
                <option key={l._id} value={l._id}>{l.name} ({l.mobile}) - {l.configuration}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Follow-up Type</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Phone Call">Phone Call</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
                <option value="Meeting">Meeting</option>
                <option value="Video Call">Video Call</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Executive Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.executiveName}
                onChange={(e) => setFormData({ ...formData, executiveName: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Scheduled Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                type="text"
                className="form-input"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Next Follow-up Date (Optional)</label>
            <input
              type="date"
              className="form-input"
              value={formData.nextFollowUpDate}
              onChange={(e) => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Remarks / Discussion Purpose *</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="Enter discussion notes or client queries..."
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Schedule</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default FollowUps;
