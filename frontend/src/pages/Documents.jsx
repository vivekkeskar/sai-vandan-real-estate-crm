import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, AlertTriangle, Upload, Eye } from 'lucide-react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Documents = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotification();

  const fetchDocs = async () => {
    try {
      const data = await api.get('/documents');
      setDocs(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleVerify = async (docId, newStatus) => {
    try {
      await api.put(`/documents/${docId}`, { overallStatus: newStatus });
      addToast(`Document overall status updated to ${newStatus}`, 'success');
      fetchDocs();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Document Verification</h1>
          <p className="page-subtitle">Track PAN, Aadhaar, Photo, Income Proof & Bank Statements for all buyers</p>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><div className="loading-spinner"></div></div>
        ) : docs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <h3>No Customer Documents Submitted</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Unit Number</th>
                <th>Uploaded Document Checklist</th>
                <th>Verification Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map(d => (
                <tr key={d._id}>
                  <td style={{ fontWeight: '700' }}>{d.customerName}</td>
                  <td><span className="badge badge-purple">{d.unitNumber}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {(d.documents || []).map((doc, idx) => (
                        <span key={idx} className={`badge ${doc.status === 'Verified' ? 'badge-success' : 'badge-secondary'}`}>
                          ✓ {doc.docType}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      d.overallStatus === 'Verified' ? 'badge-success' :
                      d.overallStatus === 'Submitted' ? 'badge-info' : 'badge-warning'
                    }`}>
                      {d.overallStatus}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-success btn-sm" onClick={() => handleVerify(d._id, 'Verified')}>
                      Mark Verified
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Documents;
