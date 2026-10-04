import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit2, Trash2, Phone, Mail, UserCheck } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [configFilter, setConfigFilter] = useState('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const { addToast } = useNotification();
  const navigate = useNavigate();

  const initialFormState = {
    name: '',
    mobile: '',
    email: '',
    city: 'Pune',
    budget: 6500000,
    interestedProperty: 'Sai Vandan Complex',
    configuration: '2 BHK',
    source: 'Website',
    salesExecutive: 'Rajesh Sharma',
    status: 'New Lead',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchLeads = async () => {
    try {
      let query = `?search=${search}`;
      if (statusFilter !== 'All') query += `&status=${statusFilter}`;
      if (sourceFilter !== 'All') query += `&source=${sourceFilter}`;
      if (configFilter !== 'All') query += `&configuration=${configFilter}`;

      const data = await api.get(`/leads${query}`);
      setLeads(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter, sourceFilter, configFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLead) {
        await api.put(`/leads/${editingLead._id}`, formData);
        addToast('Lead details updated successfully', 'success');
      } else {
        await api.post('/leads', formData);
        addToast('New lead enquiry created successfully', 'success');
      }
      setIsAddModalOpen(false);
      setEditingLead(null);
      setFormData(initialFormState);
      fetchLeads();
    } catch (err) {
      addToast(err.message || 'Failed to save lead', 'error');
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setFormData(lead);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead enquiry?')) {
      try {
        await api.delete(`/leads/${id}`);
        addToast('Lead deleted successfully', 'success');
        fetchLeads();
      } catch (err) {
        addToast(err.message, 'error');
      }
    }
  };

  const sourcesList = ['Website', 'Facebook', 'Instagram', 'Google Ads', 'WhatsApp', 'Phone Call', 'Walk-in', 'Referral', 'Property Portal'];
  const statusesList = ['New Lead', 'Contacted', 'Qualified', 'Not Interested', 'Future Prospect', 'Wrong Number', 'Duplicate', 'Converted'];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Client Enquiries & Lead Management</h1>
          <p className="page-subtitle">Track, qualify, and nurture property prospects for Sai Vandan Complex</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingLead(null); setFormData(initialFormState); setIsAddModalOpen(true); }}>
          <Plus size={18} /> Add New Lead
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by customer name, mobile, email, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '160px' }}>
            <option value="All">All Statuses</option>
            {statusesList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select className="form-select" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} style={{ width: '160px' }}>
            <option value="All">All Sources</option>
            {sourcesList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select className="form-select" value={configFilter} onChange={(e) => setConfigFilter(e.target.value)} style={{ width: '140px' }}>
            <option value="All">All Configs</option>
            <option value="1 BHK">1 BHK</option>
            <option value="2 BHK">2 BHK</option>
            <option value="3 BHK">3 BHK</option>
            <option value="4 BHK">4 BHK</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Fetching leads list...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No Lead Enquiries Found</h3>
            <p>Try adjusting your search criteria or add a new lead.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Mobile & Email</th>
                <th>Configuration</th>
                <th>Budget (INR)</th>
                <th>Source</th>
                <th>Sales Executive</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{lead.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>City: {lead.city}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={12} color="var(--primary)" /> {lead.mobile}
                    </div>
                    {lead.email && (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Mail size={12} /> {lead.email}
                      </div>
                    )}
                  </td>
                  <td><span className="badge badge-purple">{lead.configuration}</span></td>
                  <td style={{ fontWeight: '700' }}>₹{(lead.budget / 100000).toFixed(2)} Lakhs</td>
                  <td><span className="badge badge-secondary">{lead.source}</span></td>
                  <td>{lead.salesExecutive}</td>
                  <td>
                    <span className={`badge ${
                      lead.status === 'Converted' ? 'badge-success' :
                      lead.status === 'Qualified' ? 'badge-info' :
                      lead.status === 'New Lead' ? 'badge-warning' : 'badge-secondary'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button 
                        className="btn-icon btn-secondary" 
                        onClick={() => navigate(`/leads/${lead._id}`)} 
                        title="View Full Profile & Journey"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="btn-icon btn-secondary" 
                        onClick={() => handleEdit(lead)} 
                        title="Edit Lead"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="btn-icon btn-secondary" 
                        onClick={() => handleDelete(lead._id)} 
                        title="Delete Lead"
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Lead Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingLead ? 'Edit Lead Enquiry' : 'Add New Client Lead Enquiry'}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ramesh Patil"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input
                type="text"
                className="form-input"
                placeholder="+91 98900 11223"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="customer@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Target Budget (INR) *</label>
              <input
                type="number"
                className="form-input"
                placeholder="6500000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Flat Configuration *</label>
              <select
                className="form-select"
                value={formData.configuration}
                onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}
              >
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4 BHK">4 BHK</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Lead Source</label>
              <select
                className="form-select"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              >
                {sourcesList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sales Executive</label>
              <input
                type="text"
                className="form-input"
                value={formData.salesExecutive}
                onChange={(e) => setFormData({ ...formData, salesExecutive: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {statusesList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Initial Remarks / Notes</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="Enter customer preferences, family requirement..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            ></textarea>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Lead</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Leads;
