import React, { useState, useEffect } from 'react';
import { Building2, Plus, Filter, Grid, List, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  
  const [wingFilter, setWingFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [availFilter, setAvailFilter] = useState('All');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProp, setEditingProp] = useState(null);
  const { addToast } = useNotification();

  const initialForm = {
    projectName: 'Sai Vandan Complex',
    wing: 'A Wing',
    floor: 1,
    unitNumber: 'A-103',
    flatType: '2 BHK',
    carpetArea: 750,
    builtUpArea: 950,
    price: 6500000,
    parking: 'Covered',
    availability: 'Available',
    amenities: 'Gym, Clubhouse, Security'
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchProperties = async () => {
    try {
      let query = `?search=${search}`;
      if (wingFilter !== 'All') query += `&wing=${wingFilter}`;
      if (typeFilter !== 'All') query += `&flatType=${typeFilter}`;
      if (availFilter !== 'All') query += `&availability=${availFilter}`;

      const data = await api.get(`/properties${query}`);
      setProperties(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [search, wingFilter, typeFilter, availFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amenitiesArr = typeof formData.amenities === 'string' ? formData.amenities.split(',').map(s => s.trim()) : formData.amenities;
    try {
      if (editingProp) {
        await api.put(`/properties/${editingProp._id}`, { ...formData, amenities: amenitiesArr });
        addToast('Property unit updated', 'success');
      } else {
        await api.post('/properties', { ...formData, amenities: amenitiesArr });
        addToast('New property unit added', 'success');
      }
      setIsModalOpen(false);
      setEditingProp(null);
      fetchProperties();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Property Inventory & Flats</h1>
          <p className="page-subtitle">Sai Vandan Complex • Flat Availability, Prices & Floor Plans</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} /> Grid Cards
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('table')}
            >
              <List size={16} /> Table View
            </button>
          </div>

          <button className="btn btn-primary" onClick={() => { setEditingProp(null); setFormData(initialForm); setIsModalOpen(true); }}>
            <Plus size={18} /> Add Unit
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filter-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Search by unit number (e.g. A-101)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '280px' }}
        />

        <div style={{ display: 'flex', gap: '12px' }}>
          <select className="form-select" value={wingFilter} onChange={(e) => setWingFilter(e.target.value)} style={{ width: '130px' }}>
            <option value="All">All Wings</option>
            <option value="A Wing">A Wing</option>
            <option value="B Wing">B Wing</option>
            <option value="C Wing">C Wing</option>
          </select>

          <select className="form-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ width: '130px' }}>
            <option value="All">All BHKs</option>
            <option value="1 BHK">1 BHK</option>
            <option value="2 BHK">2 BHK</option>
            <option value="3 BHK">3 BHK</option>
            <option value="4 BHK">4 BHK</option>
          </select>

          <select className="form-select" value={availFilter} onChange={(e) => setAvailFilter(e.target.value)} style={{ width: '140px' }}>
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Content Rendering: Grid Cards or Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading inventory...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏢</div>
          <h3>No Property Units Match Criteria</h3>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid-3">
          {properties.map(p => (
            <div key={p._id} className="card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>Unit {p.unitNumber}</h3>
                <span className={`badge ${
                  p.availability === 'Available' ? 'badge-success' :
                  p.availability === 'Reserved' ? 'badge-warning' : 'badge-danger'
                }`}>
                  {p.availability}
                </span>
              </div>

              <div style={{ fontSize: '13px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Wing / Floor:</span> <strong>{p.wing} (Fl {p.floor})</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Type:</span> <strong>{p.flatType}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Carpet Area:</span> <strong>{p.carpetArea} sq ft</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Built-up:</span> <strong>{p.builtUpArea} sq ft</strong></div>
              </div>

              <div style={{ 
                padding: '12px', 
                background: 'var(--primary-light)', 
                borderRadius: '8px', 
                display: 'flex', 
                justify: 'space-between', 
                alignItems: 'center',
                marginBottom: '12px' 
              }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)' }}>Agreed List Price</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>
                  ₹{(p.price / 100000).toFixed(2)} Lakhs
                </span>
              </div>

              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {(p.amenities || []).map((a, i) => (
                  <span key={i} className="badge badge-secondary" style={{ fontSize: '10px' }}>{a}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Unit No</th>
                <th>Wing</th>
                <th>Floor</th>
                <th>Flat Type</th>
                <th>Carpet Area</th>
                <th>Built-up Area</th>
                <th>Price (INR)</th>
                <th>Parking</th>
                <th>Availability Status</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(p => (
                <tr key={p._id}>
                  <td style={{ fontWeight: '800', color: 'var(--primary)' }}>{p.unitNumber}</td>
                  <td>{p.wing}</td>
                  <td>Floor {p.floor}</td>
                  <td><span className="badge badge-purple">{p.flatType}</span></td>
                  <td>{p.carpetArea} sq ft</td>
                  <td>{p.builtUpArea} sq ft</td>
                  <td style={{ fontWeight: '700' }}>₹{(p.price / 100000).toFixed(2)} L</td>
                  <td>{p.parking}</td>
                  <td>
                    <span className={`badge ${
                      p.availability === 'Available' ? 'badge-success' :
                      p.availability === 'Reserved' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {p.availability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Property Inventory Unit"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Wing *</label>
              <select className="form-select" value={formData.wing} onChange={(e) => setFormData({ ...formData, wing: e.target.value })}>
                <option value="A Wing">A Wing</option>
                <option value="B Wing">B Wing</option>
                <option value="C Wing">C Wing</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Floor Number *</label>
              <input type="number" className="form-input" value={formData.floor} onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Unit Number (e.g. A-101) *</label>
              <input type="text" className="form-input" value={formData.unitNumber} onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Flat Type *</label>
              <select className="form-select" value={formData.flatType} onChange={(e) => setFormData({ ...formData, flatType: e.target.value })}>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4 BHK">4 BHK</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Carpet Area (sq ft) *</label>
              <input type="number" className="form-input" value={formData.carpetArea} onChange={(e) => setFormData({ ...formData, carpetArea: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Built-up Area (sq ft) *</label>
              <input type="number" className="form-input" value={formData.builtUpArea} onChange={(e) => setFormData({ ...formData, builtUpArea: Number(e.target.value) })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price (INR) *</label>
              <input type="number" className="form-input" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Availability Status</label>
              <select className="form-select" value={formData.availability} onChange={(e) => setFormData({ ...formData, availability: e.target.value })}>
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Amenities (Comma-separated)</label>
            <input type="text" className="form-input" value={formData.amenities} onChange={(e) => setFormData({ ...formData, amenities: e.target.value })} />
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Property Unit</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Properties;
