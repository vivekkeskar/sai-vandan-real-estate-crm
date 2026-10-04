import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Login = () => {
  const [email, setEmail] = useState('admin@saivandan.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      login(data, data.token);
      addToast(`Welcome back, ${data.name}! Logged in as ${data.role}`, 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const quickRoles = [
    { role: 'Admin', email: 'admin@saivandan.com', pass: 'admin123', color: '#2563EB' },
    { role: 'Sales Exec', email: 'sales@saivandan.com', pass: 'sales123', color: '#10B981' },
    { role: 'HR', email: 'hr@saivandan.com', pass: 'hr123', color: '#8B5CF6' },
    { role: 'Accounts', email: 'accounts@saivandan.com', pass: 'accounts123', color: '#F59E0B' },
    { role: 'Manager', email: 'manager@saivandan.com', pass: 'manager123', color: '#0F172A' },
    { role: 'Employee', email: 'employee@saivandan.com', pass: 'emp123', color: '#64748B' }
  ];

  const handleQuickLogin = (roleItem) => {
    setEmail(roleItem.email);
    setPassword(roleItem.pass);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F172A',
      backgroundImage: 'radial-gradient(circle at 50% 0%, #1E293B 0%, #0F172A 75%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '36px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Brand Logo Header */}
        <div style={{ textAlignment: 'center', marginBottom: '28px', textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)'
          }}>
            <Building size={30} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
            SAI VANDAN COMPLEX
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', marginTop: '2px' }}>
            Residential Flats CRM • Mrs. Snehal Kulkarni
          </p>
        </div>

        {/* Quick Demo Role Selector */}
        <div style={{ marginBottom: '24px', background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
            ⚡ Select Demo Role to Test
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {quickRoles.map(r => (
              <button
                key={r.role}
                type="button"
                onClick={() => handleQuickLogin(r)}
                style={{
                  padding: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: email === r.email ? r.color : '#CBD5E1',
                  backgroundColor: email === r.email ? `${r.color}15` : '#FFFFFF',
                  color: email === r.email ? r.color : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {r.role}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                placeholder="name@saivandan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '38px' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '38px' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px', padding: '12px', fontSize: '15px' }}
          >
            {loading ? <span className="loading-spinner"></span> : <>Login to CRM <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ShieldCheck size={16} color="#10B981" />
          <span>Role-Based Access Control & JWT Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
