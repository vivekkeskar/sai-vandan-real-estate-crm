import React, { useState, useEffect } from 'react';
import { KeyRound, CheckCircle2, Clock, Plus } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const Possession = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    customerName: 'Mrs. Snehal Kulkarni',
    bookingId: '',
    unitNumber: 'A-101',
    finalInspection: true,
    utilityConnection: true,
    keyHandover: false,
    possessionLetter: false,
    status: 'Ready',
    remarks: 'Flat ready for key handover ceremony'
  });

  const fetchItems = async () => {
    try {
      const data = await api.get('/possession');
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
      await api.post('/possession', formData);
      addToast('Possession checklist updated', 'success');
      setIsModalOpen(false);
      fetchItems();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Possession & Key Handover Checklist</h1>
          <p className="page-subtitle">Final flat inspection, utility connection & possession letter tracker</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Record Possession Status
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><div className="loading-spinner"></div></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔑</div>
            <h3>No Possession Records Found</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Unit Number</th>
                <th>Final Inspection</th>
                <th>Utility Connection</th>
                <th>Possession Letter Issued</th>
                <th>Key Handover</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  <td style={{ fontWeight: '700' }}>{item.customerName}</td>
                  <td><span className="badge badge-purple">{item.unitNumber}</span></td>
                  <td><span className={`badge ${item.finalInspection ? 'badge-success' : 'badge-secondary'}`}>{item.finalInspection ? '✓ Passed' : 'Pending'}</span></td>
                  <td><span className={`badge ${item.utilityConnection ? 'badge-success' : 'badge-secondary'}`}>{item.utilityConnection ? '✓ Connected' : 'Pending'}</span></td>
                  <td><span className={`badge ${item.possessionLetter ? 'badge-success' : 'badge-secondary'}`}>{item.possessionLetter ? '✓ Issued' : 'Pending'}</span></td>
                  <td><span className={`badge ${item.keyHandover ? 'badge-success' : 'badge-secondary'}`}>{item.keyHandover ? '✓ Handed Over' : 'Pending'}</span></td>
                  <td>
                    <span className={`badge ${item.status === 'Delivered' ? 'badge-success' : 'badge-warning'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Possession Checklist">
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
              <label className="form-label">Final Joint Inspection Passed?</label>
              <select className="form-select" value={formData.finalInspection ? 'Yes' : 'No'} onChange={(e) => setFormData({ ...formData, finalInspection: e.target.value === 'Yes' })}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Electricity & Water Connected?</label>
              <select className="form-select" value={formData.utilityConnection ? 'Yes' : 'No'} onChange={(e) => setFormData({ ...formData, utilityConnection: e.target.value === 'Yes' })}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Possession Letter Issued?</label>
              <select className="form-select" value={formData.possessionLetter ? 'Yes' : 'No'} onChange={(e) => setFormData({ ...formData, possessionLetter: e.target.value === 'Yes' })}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Key Handed Over?</label>
              <select className="form-select" value={formData.keyHandover ? 'Yes' : 'No'} onChange={(e) => setFormData({ ...formData, keyHandover: e.target.value === 'Yes' })}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Overall Status</label>
            <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Possession Record</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Possession;
