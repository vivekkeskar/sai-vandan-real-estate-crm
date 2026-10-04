import React, { useState, useEffect } from 'react';
import { Calendar, UserCheck, Plus, Check, X } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' or 'leaves'
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const { addToast } = useNotification();

  const [leaveForm, setLeaveForm] = useState({
    employeeId: 'EMP-101',
    employeeName: 'Rajesh Sharma',
    leaveType: 'Casual Leave',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    reason: 'Personal family work',
    approvalStatus: 'Pending'
  });

  const fetchData = async () => {
    try {
      const attData = await api.get('/attendance');
      setAttendance(attData);
      const lData = await api.get('/leaves');
      setLeaves(lData);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves', leaveForm);
      addToast('Leave request submitted to HR', 'success');
      setIsLeaveModalOpen(false);
      fetchData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleLeaveApproval = async (id, status) => {
    try {
      await api.put(`/leaves/${id}`, { approvalStatus: status });
      addToast(`Leave request ${status.toLowerCase()}`, 'success');
      fetchData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance & Leave Management</h1>
          <p className="page-subtitle">Track daily staff check-ins, leaves & HR approvals</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className={`btn ${activeTab === 'attendance' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setActiveTab('attendance')}>
            Daily Attendance Logs
          </button>
          <button className={`btn ${activeTab === 'leaves' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setActiveTab('leaves')}>
            Leave Applications
          </button>
          <button className="btn btn-primary" onClick={() => setIsLeaveModalOpen(true)}>
            + Apply Leave
          </button>
        </div>
      </div>

      {activeTab === 'attendance' ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(a => (
                <tr key={a._id}>
                  <td style={{ fontWeight: '700' }}>{a.employeeName}</td>
                  <td><span className="badge badge-secondary">{a.employeeId}</span></td>
                  <td>{new Date(a.date).toLocaleDateString()}</td>
                  <td>{a.checkIn}</td>
                  <td>{a.checkOut}</td>
                  <td>
                    <span className={`badge ${
                      a.status === 'Present' ? 'badge-success' : 'badge-danger'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Reason</th>
                <th>Approval Status</th>
                <th style={{ textAlign: 'right' }}>HR Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(l => (
                <tr key={l._id}>
                  <td style={{ fontWeight: '700' }}>{l.employeeName}</td>
                  <td><span className="badge badge-purple">{l.leaveType}</span></td>
                  <td>{new Date(l.fromDate).toLocaleDateString()}</td>
                  <td>{new Date(l.toDate).toLocaleDateString()}</td>
                  <td style={{ maxWidth: '200px' }}>{l.reason}</td>
                  <td>
                    <span className={`badge ${
                      l.approvalStatus === 'Approved' ? 'badge-success' :
                      l.approvalStatus === 'Pending' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {l.approvalStatus}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {l.approvalStatus === 'Pending' && (
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button className="btn btn-success btn-sm" onClick={() => handleLeaveApproval(l._id, 'Approved')}>Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleLeaveApproval(l._id, 'Rejected')}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} title="Submit Leave Request">
        <form onSubmit={handleApplyLeave}>
          <div className="form-group">
            <label className="form-label">Employee Name *</label>
            <input type="text" className="form-input" value={leaveForm.employeeName} onChange={(e) => setLeaveForm({ ...leaveForm, employeeName: e.target.value })} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Leave Category</label>
              <select className="form-select" value={leaveForm.leaveType} onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Earned Leave">Earned Leave</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">From Date *</label>
              <input type="date" className="form-input" value={leaveForm.fromDate} onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">To Date *</label>
              <input type="date" className="form-input" value={leaveForm.toDate} onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Leave *</label>
            <textarea className="form-textarea" rows="3" value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} required></textarea>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsLeaveModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Submit Leave Request</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Attendance;
