import React, { useState, useEffect } from 'react';
import { Banknote, Plus, Printer, CheckCircle, Calculator } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import SalarySlipModal from '../components/SalarySlipModal';
import { useNotification } from '../context/NotificationContext';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayrollForSlip, setSelectedPayrollForSlip] = useState(null);

  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    employeeId: 'EMP-101',
    employeeName: 'Rajesh Sharma',
    salaryMonth: 'October 2026',
    basic: 35000,
    hra: 15000,
    incentives: 12000,
    salesCommission: 5000,
    bonus: 0,
    pf: 1800,
    esic: 450,
    professionalTax: 200,
    advanceSalary: 0,
    loanRecovery: 0,
    otherDeductions: 0,
    paymentMode: 'Bank Transfer',
    paymentStatus: 'Paid'
  });

  const fetchPayrolls = async () => {
    try {
      const data = await api.get('/payroll');
      setPayrolls(data);
      const empData = await api.get('/employees');
      setEmployees(empData);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleSelectEmp = (empId) => {
    const emp = employees.find(e => e.employeeId === empId);
    if (emp) {
      setFormData(prev => ({
        ...prev,
        employeeId: emp.employeeId,
        employeeName: emp.name,
        basic: emp.salaryStructure?.basic || 30000,
        hra: emp.salaryStructure?.hra || 12000,
        incentives: emp.salaryStructure?.incentives || 0
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payroll', formData);
      addToast('Payroll generated with auto-calculated gross & net salary', 'success');
      setIsModalOpen(false);
      fetchPayrolls();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Live calculation preview
  const grossPreview = Number(formData.basic) + Number(formData.hra) + Number(formData.incentives) + Number(formData.salesCommission) + Number(formData.bonus);
  const totalDeductionsPreview = Number(formData.pf) + Number(formData.esic) + Number(formData.professionalTax) + Number(formData.advanceSalary) + Number(formData.loanRecovery) + Number(formData.otherDeductions);
  const netPreview = Math.max(0, grossPreview - totalDeductionsPreview);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payroll & Salary Slip Management</h1>
          <p className="page-subtitle">Monthly staff salaries, PF/ESIC deductions & payslip generator</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Generate Payroll Entry
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><div className="loading-spinner"></div></div>
        ) : payrolls.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💵</div>
            <h3>No Payroll Records Generated</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Salary Month</th>
                <th>Gross Salary</th>
                <th>Total Deductions</th>
                <th>Net Salary Paid</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map(p => (
                <tr key={p._id}>
                  <td style={{ fontWeight: '700' }}>{p.employeeName}</td>
                  <td><span className="badge badge-secondary">{p.employeeId}</span></td>
                  <td>{p.salaryMonth}</td>
                  <td>₹{p.grossSalary?.toLocaleString()}</td>
                  <td style={{ color: 'var(--danger)' }}>-₹{p.totalDeductions?.toLocaleString()}</td>
                  <td style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '15px' }}>₹{p.netSalary?.toLocaleString()}</td>
                  <td>{p.paymentMode}</td>
                  <td>
                    <span className={`badge ${p.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => setSelectedPayrollForSlip(p)}
                      style={{ gap: '4px' }}
                    >
                      <Printer size={14} /> View Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Generate Payroll Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate Monthly Salary Entry" maxWidth="750px">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Select Employee *</label>
              <select className="form-select" onChange={(e) => handleSelectEmp(e.target.value)} required>
                <option value="">-- Select Staff --</option>
                {employees.map(e => (
                  <option key={e._id} value={e.employeeId}>{e.name} ({e.employeeId} - {e.department})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Salary Month *</label>
              <input type="text" className="form-input" value={formData.salaryMonth} onChange={(e) => setFormData({ ...formData, salaryMonth: e.target.value })} required />
            </div>
          </div>

          <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '12px 0 8px', color: 'var(--success)' }}>Earnings & Allowances</h4>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Basic Salary</label>
              <input type="number" className="form-input" value={formData.basic} onChange={(e) => setFormData({ ...formData, basic: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">HRA</label>
              <input type="number" className="form-input" value={formData.hra} onChange={(e) => setFormData({ ...formData, hra: Number(e.target.value) })} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Sales Commission / Incentives</label>
              <input type="number" className="form-input" value={formData.incentives} onChange={(e) => setFormData({ ...formData, incentives: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Bonus</label>
              <input type="number" className="form-input" value={formData.bonus} onChange={(e) => setFormData({ ...formData, bonus: Number(e.target.value) })} />
            </div>
          </div>

          <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '12px 0 8px', color: 'var(--danger)' }}>Deductions & Statutory</h4>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">PF Deduction</label>
              <input type="number" className="form-input" value={formData.pf} onChange={(e) => setFormData({ ...formData, pf: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">ESIC Deduction</label>
              <input type="number" className="form-input" value={formData.esic} onChange={(e) => setFormData({ ...formData, esic: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Professional Tax (PT)</label>
              <input type="number" className="form-input" value={formData.professionalTax} onChange={(e) => setFormData({ ...formData, professionalTax: Number(e.target.value) })} />
            </div>
          </div>

          {/* Live Auto Calculation Card */}
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid var(--border)', margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Gross: ₹{grossPreview.toLocaleString()} | Deductions: ₹{totalDeductionsPreview.toLocaleString()}</span>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>Net Payable: ₹{netPreview.toLocaleString()}</h3>
            </div>
            <span className="badge badge-success">Auto-Calculated</span>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Process Salary</button>
          </div>
        </form>
      </Modal>

      {/* Payslip Modal */}
      <SalarySlipModal
        isOpen={Boolean(selectedPayrollForSlip)}
        onClose={() => setSelectedPayrollForSlip(null)}
        payroll={selectedPayrollForSlip}
      />

    </div>
  );
};

export default Payroll;
