import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, Mail, MapPin, Calendar, CheckCircle2, Clock, 
  Building2, CreditCard, ShieldCheck, Plus, FileText 
} from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../context/NotificationContext';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useNotification();

  const [leadData, setLeadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isQualModalOpen, setIsQualModalOpen] = useState(false);

  const [qualForm, setQualForm] = useState({
    budget: 6500000,
    loanRequired: true,
    preferredLocation: 'Sai Vandan Complex, Baner',
    flatType: '2 BHK',
    purchaseTimeline: '1 Month',
    purchaseIntent: 'Self Use',
    remarks: ''
  });

  const fetchLeadDetail = async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      setLeadData(res);
      if (res.qualification) {
        setQualForm(res.qualification);
      } else if (res.lead) {
        setQualForm(prev => ({ ...prev, budget: res.lead.budget, flatType: res.lead.configuration }));
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetail();
  }, [id]);

  const handleSaveQualification = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/leads/${id}/qualification`, qualForm);
      addToast('Lead qualification details saved & lead status updated to Qualified!', 'success');
      setIsQualModalOpen(false);
      fetchLeadDetail();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading Lead Profile...</p>
      </div>
    );
  }

  const { lead, qualification, followUps, siteVisits } = leadData || {};

  return (
    <div className="page-container">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '16px' }}>
        <ArrowLeft size={16} /> Back to Leads
      </button>

      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: '800' }}>{lead?.name}</h1>
              <span className={`badge ${lead?.status === 'Converted' ? 'badge-success' : 'badge-warning'}`}>
                {lead?.status}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '14px', color: '#94A3B8', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {lead?.mobile}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {lead?.email || 'N/A'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {lead?.city}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Enquired {new Date(lead?.enquiryDate).toLocaleDateString()}</span>
            </div>
          </div>
          <button onClick={() => setIsQualModalOpen(true)} className="btn btn-primary">
            + Record Qualification
          </button>
        </div>
      </div>

      {/* Customer Journey Progression Tabs / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Step 1 & 2: Lead Info & Qualification */}
        <div className="grid-2">
          
          {/* Lead Enquired Info */}
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--primary)' }}>
              1. Basic Lead Profile
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Interested Property</span><p style={{ fontWeight: '700' }}>{lead?.interestedProperty}</p></div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Configuration</span><p style={{ fontWeight: '700' }}>{lead?.configuration}</p></div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Target Budget</span><p style={{ fontWeight: '700' }}>₹{(lead?.budget / 100000).toFixed(2)} Lakhs</p></div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Lead Source</span><p><span className="badge badge-secondary">{lead?.source}</span></p></div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Assigned Executive</span><p style={{ fontWeight: '600' }}>{lead?.salesExecutive}</p></div>
            </div>
          </div>

          {/* Qualification Details */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--success)' }}>
                2. Qualification Matrix
              </h3>
              {!qualification && <span className="badge badge-warning">Needs Qualification</span>}
            </div>

            {qualification ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Loan Required</span><p style={{ fontWeight: '700' }}>{qualification.loanRequired ? 'Yes (Bank Loan)' : 'No (Self Funded)'}</p></div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Purchase Timeline</span><p style={{ fontWeight: '700' }}>{qualification.purchaseTimeline}</p></div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Purchase Intent</span><p style={{ fontWeight: '700' }}>{qualification.purchaseIntent}</p></div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Preferred Location</span><p style={{ fontWeight: '600' }}>{qualification.preferredLocation}</p></div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Executive Remarks</span>
                  <p style={{ fontSize: '13px', fontStyle: 'italic', background: '#F8FAFC', padding: '8px', borderRadius: '6px' }}>"{qualification.remarks || 'No remarks added.'}"</p>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                No qualification details recorded yet. Click "Record Qualification" above to store budget, loan preference, and purchase timeline.
              </p>
            )}
          </div>

        </div>

        {/* Step 3: Follow-Up History & Site Visits */}
        <div className="grid-2">
          
          {/* Follow ups */}
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
              3. Follow-up Timeline
            </h3>
            {followUps?.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No follow-up logs recorded for this lead.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {followUps?.map(f => (
                  <div key={f._id} style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}>
                      <span>{f.type} • {f.executiveName}</span>
                      <span className="badge badge-secondary">{new Date(f.date).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{f.remarks}</p>
                    {f.nextFollowUpDate && (
                      <p style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '600', marginTop: '2px' }}>
                        Next Follow-up: {new Date(f.nextFollowUpDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Site Visits */}
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
              4. Site Visit Logs
            </h3>
            {siteVisits?.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No site visits logged yet for this prospect.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {siteVisits?.map(v => (
                  <div key={v._id} style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}>
                      <span>Visit Date: {new Date(v.visitDate).toLocaleDateString()} ({v.visitTime})</span>
                      <span className={`badge ${v.status === 'Visited' ? 'badge-success' : 'badge-warning'}`}>{v.status}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Feedback: {v.feedback || 'Pending feedback'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Qualification Modal Form */}
      <Modal
        isOpen={isQualModalOpen}
        onClose={() => setIsQualModalOpen(false)}
        title="Record Lead Qualification Matrix"
      >
        <form onSubmit={handleSaveQualification}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Verified Budget (INR)</label>
              <input
                type="number"
                className="form-input"
                value={qualForm.budget}
                onChange={(e) => setQualForm({ ...qualForm, budget: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Bank Loan Required?</label>
              <select
                className="form-select"
                value={qualForm.loanRequired ? 'Yes' : 'No'}
                onChange={(e) => setQualForm({ ...qualForm, loanRequired: e.target.value === 'Yes' })}
              >
                <option value="Yes">Yes (Bank Loan Required)</option>
                <option value="No">No (Self-Funded / Cash)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Purchase Timeline</label>
              <select
                className="form-select"
                value={qualForm.purchaseTimeline}
                onChange={(e) => setQualForm({ ...qualForm, purchaseTimeline: e.target.value })}
              >
                <option value="Immediate">Immediate (Within 15 days)</option>
                <option value="1 Month">1 Month</option>
                <option value="3 Months">3 Months</option>
                <option value="6+ Months">6+ Months</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Purchase Purpose</label>
              <select
                className="form-select"
                value={qualForm.purchaseIntent}
                onChange={(e) => setQualForm({ ...qualForm, purchaseIntent: e.target.value })}
              >
                <option value="Self Use">Self Use</option>
                <option value="Investment">Investment</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Flat Location / Wing</label>
            <input
              type="text"
              className="form-input"
              value={qualForm.preferredLocation}
              onChange={(e) => setQualForm({ ...qualForm, preferredLocation: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Qualification Notes / Remarks</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={qualForm.remarks}
              onChange={(e) => setQualForm({ ...qualForm, remarks: e.target.value })}
              placeholder="e.g. Approved pre-sanction letter from HDFC, ready to pay token booking amount."
            ></textarea>
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '20px', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsQualModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-success">Save Qualification</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default LeadDetail;
