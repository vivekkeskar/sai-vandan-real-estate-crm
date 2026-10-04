import React from 'react';
import Modal from './Modal';
import { Printer } from 'lucide-react';

const SalarySlipModal = ({ isOpen, onClose, payroll }) => {
  if (!payroll) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Salary Slip"
      maxWidth="750px"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={handlePrint} style={{ gap: '6px' }}>
            <Printer size={16} /> Print Payslip
          </button>
        </>
      }
    >
      <div style={{ padding: '20px', background: '#FFF', border: '1px solid var(--border)', borderRadius: '8px' }}>
        {/* Company Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #0F172A', paddingBottom: '16px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>SAI VANDAN COMPLEX</h2>
          <p style={{ fontSize: '13px', color: '#64748B' }}>Residential Flats CRM • Baner Road, Pune</p>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#2563EB', marginTop: '6px' }}>
            SALARY SLIP - {payroll.salaryMonth?.toUpperCase() || 'CURRENT MONTH'}
          </p>
        </div>

        {/* Employee Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', marginBottom: '20px' }}>
          <div><strong>Employee Name:</strong> {payroll.employeeName}</div>
          <div><strong>Employee ID:</strong> {payroll.employeeId}</div>
          <div><strong>Payment Date:</strong> {new Date(payroll.paymentDate || Date.now()).toLocaleDateString()}</div>
          <div><strong>Payment Mode:</strong> {payroll.paymentMode}</div>
          <div><strong>Status:</strong> <span className="badge badge-success">{payroll.paymentStatus}</span></div>
        </div>

        {/* Salary Breakdown Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '20px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Earnings</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Amount (₹)</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Deductions</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #F1F5F9' }}>Basic Salary</td>
              <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #F1F5F9' }}>{payroll.basic?.toLocaleString()}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #F1F5F9' }}>Provident Fund (PF)</td>
              <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #F1F5F9' }}>{payroll.pf?.toLocaleString()}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #F1F5F9' }}>HRA</td>
              <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #F1F5F9' }}>{payroll.hra?.toLocaleString()}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #F1F5F9' }}>ESIC</td>
              <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #F1F5F9' }}>{payroll.esic?.toLocaleString()}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #F1F5F9' }}>Incentives & Bonus</td>
              <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #F1F5F9' }}>{(payroll.incentives + payroll.bonus)?.toLocaleString()}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #F1F5F9' }}>Professional Tax (PT)</td>
              <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #F1F5F9' }}>{payroll.professionalTax?.toLocaleString()}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #F1F5F9' }}>Sales Commission</td>
              <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #F1F5F9' }}>{payroll.salesCommission?.toLocaleString()}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #F1F5F9' }}>Advance / Other</td>
              <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #F1F5F9' }}>{(payroll.advanceSalary + payroll.otherDeductions)?.toLocaleString()}</td>
            </tr>
            <tr style={{ fontWeight: '700', background: '#F8FAFC' }}>
              <td style={{ padding: '10px' }}>Gross Earnings</td>
              <td style={{ padding: '10px', textAlign: 'right', color: '#10B981' }}>₹{payroll.grossSalary?.toLocaleString()}</td>
              <td style={{ padding: '10px' }}>Total Deductions</td>
              <td style={{ padding: '10px', textAlign: 'right', color: '#EF4444' }}>₹{payroll.totalDeductions?.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {/* Net Payable */}
        <div style={{
          padding: '16px',
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '8px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '13px', color: '#1E40AF', fontWeight: '600' }}>NET SALARY PAYABLE</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#1D4ED8' }}>
            ₹{payroll.netSalary?.toLocaleString()}
          </div>
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '10px', fontSize: '12px', color: '#64748B' }}>
          <div>_______________________<br />Employee Signature</div>
          <div style={{ textAlign: 'right' }}>_______________________<br />Authorized Signatory (HR)</div>
        </div>
      </div>
    </Modal>
  );
};

export default SalarySlipModal;
