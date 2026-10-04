import React, { useState, useEffect } from 'react';
import { Truck, Plus, DollarSign, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const VendorBills = () => {
  const [bills, setBills] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedBillForPay, setSelectedBillForPay] = useState(null);

  const { addToast } = useNotification();

  const [billForm, setBillForm] = useState({
    vendorId: '',
    vendorName: '',
    invoiceNumber: 'INV-9921',
    invoiceDate: new Date().toISOString().split('T')[0],
    billAmount: 250000,
    gst: 45000,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [payForm, setPayForm] = useState({
    paidAmount: 100000,
    paymentMode: 'Bank Transfer',
    transactionNumber: 'UTR-991204812',
    bank: 'HDFC Bank'
  });

  const fetchData = async () => {
    try {
      const data = await api.get('/vendor-bills');
      setBills(data);
      const vData = await api.get('/vendors');
      setVendors(vData);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVendorSelect = (vId) => {
    const v = vendors.find(item => item._id === vId);
    if (v) {
      setBillForm(prev => ({ ...prev, vendorId: v._id, vendorName: v.companyName }));
    }
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vendor-bills', billForm);
      addToast('Vendor bill invoice logged', 'success');
      setIsBillModalOpen(false);
      fetchData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handlePayVendor = async (e) => {
    e.preventDefault();
    if (!selectedBillForPay) return;
    try {
      await api.post('/vendor-payments', {
        billId: selectedBillForPay._id,
        vendorId: selectedBillForPay.vendorId?._id || selectedBillForPay.vendorId,
        vendorName: selectedBillForPay.vendorName,
        ...payForm
      });
      addToast(`Payment of ₹${payForm.paidAmount.toLocaleString()} paid to ${selectedBillForPay.vendorName}`, 'success');
      setIsPayModalOpen(false);
      fetchData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Vendor Bills & Outstanding Payments</h1>
          <p className="page-subtitle">Contractor invoices, GST bills, vendor ledgers & partial payment entries</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsBillModalOpen(true)}>
          <Plus size={18} /> Record Vendor Bill
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><div className="loading-spinner"></div></div>
        ) : bills.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚛</div>
            <h3>No Vendor Bills Recorded</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Vendor Company</th>
                <th>Bill Date</th>
                <th>Total Bill Amount</th>
                <th>Amount Paid</th>
                <th>Outstanding Balance</th>
                <th>Due Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(b => (
                <tr key={b._id}>
                  <td style={{ fontWeight: '800', color: 'var(--primary)' }}>{b.invoiceNumber}</td>
                  <td style={{ fontWeight: '700' }}>{b.vendorName}</td>
                  <td>{new Date(b.invoiceDate).toLocaleDateString()}</td>
                  <td style={{ fontWeight: '700' }}>₹{b.billAmount?.toLocaleString()}</td>
                  <td style={{ color: 'var(--success)', fontWeight: '700' }}>₹{b.paidAmount?.toLocaleString()}</td>
                  <td style={{ color: 'var(--danger)', fontWeight: '800', fontSize: '15px' }}>₹{b.balanceAmount?.toLocaleString()}</td>
                  <td>{new Date(b.dueDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${
                      b.status === 'Fully Paid' ? 'badge-success' :
                      b.status === 'Partially Paid' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {b.balanceAmount > 0 && (
                      <button className="btn btn-success btn-sm" onClick={() => { setSelectedBillForPay(b); setPayForm({ ...payForm, paidAmount: b.balanceAmount }); setIsPayModalOpen(true); }}>
                        Pay Vendor
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Record Bill Modal */}
      <Modal isOpen={isBillModalOpen} onClose={() => setIsBillModalOpen(false)} title="Record Vendor Invoice Bill">
        <form onSubmit={handleAddBill}>
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
              <label className="form-label">Invoice / Bill Number *</label>
              <input type="text" className="form-input" value={billForm.invoiceNumber} onChange={(e) => setBillForm({ ...billForm, invoiceNumber: e.target.value })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Bill Base Amount (INR) *</label>
              <input type="number" className="form-input" value={billForm.billAmount} onChange={(e) => setBillForm({ ...billForm, billAmount: Number(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label className="form-label">GST Tax Amount (INR)</label>
              <input type="number" className="form-input" value={billForm.gst} onChange={(e) => setBillForm({ ...billForm, gst: Number(e.target.value) })} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Invoice Date *</label>
              <input type="date" className="form-input" value={billForm.invoiceDate} onChange={(e) => setBillForm({ ...billForm, invoiceDate: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Due Date *</label>
              <input type="date" className="form-input" value={billForm.dueDate} onChange={(e) => setBillForm({ ...billForm, dueDate: e.target.value })} required />
            </div>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsBillModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Vendor Bill</button>
          </div>
        </form>
      </Modal>

      {/* Pay Vendor Modal */}
      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title={`Pay Vendor: ${selectedBillForPay?.vendorName}`}>
        <form onSubmit={handlePayVendor}>
          <div className="form-group">
            <label className="form-label">Payment Amount (INR) *</label>
            <input type="number" className="form-input" value={payForm.paidAmount} onChange={(e) => setPayForm({ ...payForm, paidAmount: Number(e.target.value) })} required />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Max Balance Due: ₹{selectedBillForPay?.balanceAmount?.toLocaleString()}</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select className="form-select" value={payForm.paymentMode} onChange={(e) => setPayForm({ ...payForm, paymentMode: e.target.value })}>
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">UTR / Reference #</label>
              <input type="text" className="form-input" value={payForm.transactionNumber} onChange={(e) => setPayForm({ ...payForm, transactionNumber: e.target.value })} />
            </div>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsPayModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-success">Confirm Vendor Payment</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default VendorBills;
