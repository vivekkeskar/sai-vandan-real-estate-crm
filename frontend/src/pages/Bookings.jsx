import React, { useState, useEffect } from 'react';
import { BookOpenCheck, Plus, Printer, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import BookingSlipModal from '../components/BookingSlipModal';
import { useNotification } from '../context/NotificationContext';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBookingForSlip, setSelectedBookingForSlip] = useState(null);

  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    email: '',
    propertyId: '',
    unitNumber: '',
    wing: 'A Wing',
    floor: 1,
    flatType: '2 BHK',
    bookingAmount: 500000,
    bookingDate: new Date().toISOString().split('T')[0],
    finalPrice: 6500000,
    salesExecutive: 'Rajesh Sharma',
    status: 'Confirmed'
  });

  const fetchBookings = async () => {
    try {
      const data = await api.get('/bookings');
      setBookings(data);
      const propData = await api.get('/properties?availability=Available');
      setProperties(propData);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePropertySelect = (propId) => {
    const p = properties.find(item => item._id === propId);
    if (p) {
      setFormData(prev => ({
        ...prev,
        propertyId: p._id,
        unitNumber: p.unitNumber,
        wing: p.wing,
        floor: p.floor,
        flatType: p.flatType,
        finalPrice: p.price
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', formData);
      addToast('Property booking confirmed & unit status updated to SOLD!', 'success');
      setIsAddModalOpen(false);
      fetchBookings();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Property Booking Management</h1>
          <p className="page-subtitle">Sai Vandan Complex • Confirmed Flat Allotments & Token Receipts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} /> New Property Booking
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><div className="loading-spinner"></div></div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📖</div>
            <h3>No Property Bookings Recorded</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Mobile</th>
                <th>Unit Number</th>
                <th>Flat Type</th>
                <th>Booking Amount</th>
                <th>Final Agreement Price</th>
                <th>Booking Date</th>
                <th>Executive</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Slip / Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id}>
                  <td style={{ fontWeight: '700' }}>{b.customerName}</td>
                  <td>{b.mobile}</td>
                  <td><span className="badge badge-purple">{b.unitNumber} ({b.wing})</span></td>
                  <td>{b.flatType}</td>
                  <td style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{(b.bookingAmount / 100000).toFixed(2)}L</td>
                  <td style={{ fontWeight: '800', color: 'var(--success)' }}>₹{(b.finalPrice / 100000).toFixed(2)}L</td>
                  <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                  <td>{b.salesExecutive}</td>
                  <td>
                    <span className={`badge ${
                      b.status === 'Confirmed' ? 'badge-success' :
                      b.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => setSelectedBookingForSlip(b)}
                      style={{ gap: '4px' }}
                    >
                      <Printer size={14} /> Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Booking Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Property Booking">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Select Available Unit *</label>
              <select className="form-select" onChange={(e) => handlePropertySelect(e.target.value)} required>
                <option value="">-- Choose Unit --</option>
                {properties.map(p => (
                  <option key={p._id} value={p._id}>Unit {p.unitNumber} ({p.wing}, {p.flatType}) - ₹{(p.price / 100000).toFixed(2)}L</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input type="text" className="form-input" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input type="text" className="form-input" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Token Booking Amount (INR) *</label>
              <input type="number" className="form-input" value={formData.bookingAmount} onChange={(e) => setFormData({ ...formData, bookingAmount: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Final Agreed Price (INR) *</label>
              <input type="number" className="form-input" value={formData.finalPrice} onChange={(e) => setFormData({ ...formData, finalPrice: Number(e.target.value) })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Sales Executive</label>
              <input type="text" className="form-input" value={formData.salesExecutive} onChange={(e) => setFormData({ ...formData, salesExecutive: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Booking Status</label>
              <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Confirm Booking</button>
          </div>
        </form>
      </Modal>

      {/* Booking Confirmation Slip Modal */}
      <BookingSlipModal
        isOpen={Boolean(selectedBookingForSlip)}
        onClose={() => setSelectedBookingForSlip(null)}
        booking={selectedBookingForSlip}
      />

    </div>
  );
};

export default Bookings;
