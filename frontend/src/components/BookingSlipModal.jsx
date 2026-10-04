import React from 'react';
import Modal from './Modal';
import { Printer, CheckCircle } from 'lucide-react';

const BookingSlipModal = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Property Booking Confirmation Slip"
      maxWidth="700px"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={handlePrint} style={{ gap: '6px' }}>
            <Printer size={16} /> Print Confirmation
          </button>
        </>
      }
    >
      <div style={{ padding: '24px', background: '#FFF', border: '1px solid var(--border)', borderRadius: '12px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px dashed #CBD5E1', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#10B981', marginBottom: '4px' }}>
            <CheckCircle size={28} />
            <span style={{ fontSize: '18px', fontWeight: '800' }}>BOOKING CONFIRMED</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>SAI VANDAN COMPLEX</h2>
          <p style={{ fontSize: '13px', color: '#64748B' }}>Baner Road, Pune 411045 • Mrs. Snehal Kulkarni Project</p>
        </div>

        {/* Grid Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px', marginBottom: '24px' }}>
          <div>
            <span style={{ color: '#64748B', fontSize: '12px' }}>Customer Name</span>
            <p style={{ fontWeight: '700', color: '#0F172A' }}>{booking.customerName}</p>
          </div>
          <div>
            <span style={{ color: '#64748B', fontSize: '12px' }}>Contact Number</span>
            <p style={{ fontWeight: '700', color: '#0F172A' }}>{booking.mobile}</p>
          </div>
          <div>
            <span style={{ color: '#64748B', fontSize: '12px' }}>Booked Unit</span>
            <p style={{ fontWeight: '800', color: '#2563EB', fontSize: '16px' }}>{booking.unitNumber} ({booking.wing})</p>
          </div>
          <div>
            <span style={{ color: '#64748B', fontSize: '12px' }}>Configuration</span>
            <p style={{ fontWeight: '700', color: '#0F172A' }}>{booking.flatType} • Floor {booking.floor}</p>
          </div>
          <div>
            <span style={{ color: '#64748B', fontSize: '12px' }}>Agreed Final Price</span>
            <p style={{ fontWeight: '800', color: '#10B981', fontSize: '16px' }}>₹{booking.finalPrice?.toLocaleString()}</p>
          </div>
          <div>
            <span style={{ color: '#64748B', fontSize: '12px' }}>Booking Token Paid</span>
            <p style={{ fontWeight: '700', color: '#0F172A' }}>₹{booking.bookingAmount?.toLocaleString()}</p>
          </div>
          <div>
            <span style={{ color: '#64748B', fontSize: '12px' }}>Booking Date</span>
            <p style={{ fontWeight: '600' }}>{new Date(booking.bookingDate).toLocaleDateString()}</p>
          </div>
          <div>
            <span style={{ color: '#64748B', fontSize: '12px' }}>Assigned Executive</span>
            <p style={{ fontWeight: '600' }}>{booking.salesExecutive}</p>
          </div>
        </div>

        {/* Terms Box */}
        <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px', color: '#475569' }}>
          <strong style={{ color: '#0F172A' }}>Note:</strong> This booking confirmation is subject to agreement registration within 30 days and clearance of initial agreement payment instalment as per project slab milestones.
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', paddingTop: '10px', fontSize: '12px', color: '#64748B' }}>
          <div>_______________________<br />Customer Signature</div>
          <div style={{ textAlign: 'right' }}>_______________________<br />For Sai Vandan Complex</div>
        </div>
      </div>
    </Modal>
  );
};

export default BookingSlipModal;
