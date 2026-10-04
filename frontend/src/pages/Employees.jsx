import React, { useState, useEffect } from 'react';
import { UserCircle, Plus, Mail, Phone, Building } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    employeeId: 'EMP-104',
    name: '',
    department: 'Sales',
    designation: 'Sales Manager',
    mobile: '+91 98220 55667',
    email: '',
    basic: 35000,
    hra: 15000,
    allowances: 5000,
    incentives: 10000,
    accountNo: '501009988112',
    ifsc: 'HDFC0000123',
    bankName: 'HDFC Bank',
    pan: 'ABCDE1234F',
    aadhaar: '9988-7766-5544'
  });

  const fetchEmployees = async () => {
    try {
      const data = await api.get('/employees');
      setEmployees(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      employeeId: formData.employeeId,
      name: formData.name,
      department: formData.department,
      designation: formData.designation,
      mobile: formData.mobile,
      email: formData.email,
      salaryStructure: {
        basic: Number(formData.basic),
        hra: Number(formData.hra),
        allowances: Number(formData.allowances),
        incentives: Number(formData.incentives)
      },
      bankDetails: {
        accountNo: formData.accountNo,
        ifsc: formData.ifsc,
        bankName: formData.bankName
      },
      pan: formData.pan,
      aadhaar: formData.aadhaar
    };

    try {
      await api.post('/employees', payload);
      addToast('Employee added to Master directory', 'success');
      setIsModalOpen(false);
      fetchEmployees();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Master Directory</h1>
          <p className="page-subtitle">Manage company staff, designations, bank accounts & salary structures</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add New Employee
        </button>
      </div>

      <div className="grid-3">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', gridColumn: 'span 3' }}><div className="loading-spinner"></div></div>
        ) : employees.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: 'span 3' }}>
            <div className="empty-state-icon">👤</div>
            <h3>No Employees Found</h3>
          </div>
        ) : (
          employees.map(emp => (
            <div key={emp._id} className="card">
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '18px'
                }}>
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>{emp.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{emp.designation} • {emp.department}</p>
                  <span className="badge badge-secondary" style={{ fontSize: '10px', marginTop: '2px' }}>{emp.employeeId}</span>
                </div>
              </div>

              <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={13} color="var(--primary)" /> {emp.mobile}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={13} color="var(--text-muted)" /> {emp.email}</div>
                <div style={{ marginTop: '8px', padding: '10px', background: '#F8FAFC', borderRadius: '6px', fontSize: '12px' }}>
                  <strong>Bank:</strong> {emp.bankDetails?.bankName} ({emp.bankDetails?.accountNo})<br />
                  <strong>Base Salary:</strong> ₹{(emp.salaryStructure?.basic + emp.salaryStructure?.hra)?.toLocaleString()}/mo
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Employee Master">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Employee ID *</label>
              <input type="text" className="form-input" value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select className="form-select" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                <option value="Sales">Sales</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Engineering">Engineering</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Designation *</label>
              <input type="text" className="form-input" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input type="text" className="form-input" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Basic Salary (INR)</label>
              <input type="number" className="form-input" value={formData.basic} onChange={(e) => setFormData({ ...formData, basic: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">HRA (INR)</label>
              <input type="number" className="form-input" value={formData.hra} onChange={(e) => setFormData({ ...formData, hra: Number(e.target.value) })} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Bank Account #</label>
              <input type="text" className="form-input" value={formData.accountNo} onChange={(e) => setFormData({ ...formData, accountNo: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Bank Name & IFSC</label>
              <input type="text" className="form-input" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} />
            </div>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Employee</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Employees;
