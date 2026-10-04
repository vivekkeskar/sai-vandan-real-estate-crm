import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const Purchases = () => {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    poNumber: 'PO-2026-9912',
    vendorId: '',
    vendorName: '',
    material: 'Grade 53 OPC Cement Bags',
    quantity: 500,
    rate: 380,
    gstPercent: 18,
    approvalStatus: 'Approved'
  });

  const fetchOrders = async () => {
    try {
      const data = await api.get('/purchases');
      setOrders(data);
      const vData = await api.get('/vendors');
      setVendors(vData);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleVendorSelect = (vId) => {
    const v = vendors.find(item => item._id === vId);
    if (v) {
      setFormData(prev => ({ ...prev, vendorId: v._id, vendorName: v.companyName }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/purchases', formData);
      addToast('Purchase Order generated with auto GST calculation', 'success');
      setIsModalOpen(false);
      fetchOrders();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const baseAmt = formData.quantity * formData.rate;
  const totalWithGst = baseAmt + (baseAmt * (formData.gstPercent / 100));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Purchase Orders & Material Procurement</h1>
          <p className="page-subtitle">Generate POs for cement, steel, electricals & contractor materials</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Create Purchase Order
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><div className="loading-spinner"></div></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>No Purchase Orders Issued</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Vendor</th>
                <th>Material / Items</th>
                <th>Quantity</th>
                <th>Rate (INR)</th>
                <th>GST %</th>
                <th>Total PO Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td style={{ fontWeight: '800', color: 'var(--primary)' }}>{o.poNumber}</td>
                  <td style={{ fontWeight: '700' }}>{o.vendorName}</td>
                  <td>{o.material}</td>
                  <td>{o.quantity} units</td>
                  <td>₹{o.rate?.toLocaleString()}</td>
                  <td>{o.gstPercent}% GST</td>
                  <td style={{ fontWeight: '800', color: 'var(--success)', fontSize: '15px' }}>₹{o.totalAmount?.toLocaleString()}</td>
                  <td>
                    <span className="badge badge-success">{o.approvalStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue New Purchase Order">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Select Vendor *</label>
              <select className="form-select" onChange={(e) => handleVendorSelect(e.target.value)} required>
                <option value="">-- Choose Vendor --</option>
                {vendors.map(v => (
                  <option key={v._id} value={v._id}>{v.companyName} ({v.category})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">PO Number</label>
              <input type="text" className="form-input" value={formData.poNumber} onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Material Description *</label>
            <input type="text" className="form-input" value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value })} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input type="number" className="form-input" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Rate per Unit (INR) *</label>
              <input type="number" className="form-input" value={formData.rate} onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">GST Tax Rate %</label>
              <select className="form-select" value={formData.gstPercent} onChange={(e) => setFormData({ ...formData, gstPercent: Number(e.target.value) })}>
                <option value="5">5% GST</option>
                <option value="12">12% GST</option>
                <option value="18">18% GST</option>
                <option value="28">28% GST</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', margin: '14px 0' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Base: ₹{baseAmt.toLocaleString()} | Tax: ₹{(baseAmt * (formData.gstPercent / 100)).toLocaleString()}</span>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)', marginTop: '2px' }}>Total PO Value: ₹{totalWithGst.toLocaleString()}</h3>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Generate Purchase Order</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Purchases;
