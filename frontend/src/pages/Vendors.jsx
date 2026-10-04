import React, { useState, useEffect } from 'react';
import { Truck, Plus, Mail, Phone, Building } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    vendorName: '',
    companyName: '',
    category: 'Material Supplier',
    gstNumber: '27AAAAA0000A1Z5',
    panNumber: 'AAAAA0000A',
    contactPerson: '',
    mobile: '+91 98900 11223',
    email: '',
    address: 'Pune MIDC',
    accountNo: '',
    ifsc: '',
    bankName: ''
  });

  const categories = [
    'Civil Contractor', 'Electrical Contractor', 'Plumbing Contractor', 
    'Paint Contractor', 'Material Supplier', 'Lift Supplier', 
    'Security Agency', 'Housekeeping', 'Architect', 'Interior Designer', 'Legal Consultant'
  ];

  const fetchVendors = async () => {
    try {
      const data = await api.get('/vendors');
      setVendors(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      vendorName: formData.vendorName,
      companyName: formData.companyName,
      category: formData.category,
      gstNumber: formData.gstNumber,
      panNumber: formData.panNumber,
      contactPerson: formData.contactPerson,
      mobile: formData.mobile,
      email: formData.email,
      address: formData.address,
      bankDetails: { accountNo: formData.accountNo, ifsc: formData.ifsc, bankName: formData.bankName }
    };
    try {
      await api.post('/vendors', payload);
      addToast('Vendor profile added to Vendor Master', 'success');
      setIsModalOpen(false);
      fetchVendors();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Vendor Master Directory</h1>
          <p className="page-subtitle">Contractors, Material Suppliers, Architects & Service Providers for Sai Vandan Complex</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Register New Vendor
        </button>
      </div>

      <div className="grid-3">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', gridColumn: 'span 3' }}><div className="loading-spinner"></div></div>
        ) : vendors.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: 'span 3' }}>
            <div className="empty-state-icon">🚚</div>
            <h3>No Vendors Registered</h3>
          </div>
        ) : (
          vendors.map(v => (
            <div key={v._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>{v.companyName}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v.vendorName}</p>
                </div>
                <span className="badge badge-purple">{v.category}</span>
              </div>

              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <div><strong>Contact Person:</strong> {v.contactPerson}</div>
                <div><Phone size={12} inline color="var(--primary)" /> {v.mobile}</div>
                <div>GSTIN: <span className="badge badge-secondary">{v.gstNumber || 'N/A'}</span></div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Vendor Profile">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input type="text" className="form-input" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Vendor Name / Brand *</label>
              <input type="text" className="form-input" value={formData.vendorName} onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Vendor Category *</label>
              <select className="form-select" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Contact Person *</label>
              <input type="text" className="form-input" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input type="text" className="form-input" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">GST Number</label>
              <input type="text" className="form-input" value={formData.gstNumber} onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })} />
            </div>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Vendor</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Vendors;
