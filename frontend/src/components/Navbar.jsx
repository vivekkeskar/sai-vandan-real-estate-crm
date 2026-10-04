import React, { useContext, useState, useEffect } from 'react';
import { Search, Bell, LogOut, Menu, User, Check, RefreshCw } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Navbar = ({ toggleSidebar }) => {
  const { user, login, logout } = useContext(AuthContext);
  const { addToast } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Demo Accounts for Quick Switch
  const demoAccounts = [
    { name: 'Snehal Kulkarni', email: 'admin@saivandan.com', password: 'admin123', role: 'Admin' },
    { name: 'Rajesh Sharma', email: 'sales@saivandan.com', password: 'sales123', role: 'Sales Executive' },
    { name: 'Pooja Kulkarni', email: 'hr@saivandan.com', password: 'hr123', role: 'HR' },
    { name: 'Mahesh Joshi', email: 'accounts@saivandan.com', password: 'accounts123', role: 'Accounts' },
    { name: 'Vikram Deshmukh', email: 'manager@saivandan.com', password: 'manager123', role: 'Manager' },
    { name: 'Anil Patil', email: 'employee@saivandan.com', password: 'emp123', role: 'Employee' }
  ];

  const handleSwitchRole = async (account) => {
    try {
      const data = await api.post('/auth/login', { email: account.email, password: account.password });
      login(data, data.token);
      addToast(`Switched view to ${data.role} (${data.name})`, 'success');
      setShowRoleDropdown(false);
    } catch (err) {
      addToast('Failed to switch role', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
      addToast('All notifications marked as read', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header style={{
      height: 'var(--navbar-height)',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 90,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Left: Mobile Toggle & Global Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
        <button 
          onClick={toggleSidebar}
          className="btn-icon btn-secondary"
          style={{ display: 'flex' }}
        >
          <Menu size={20} />
        </button>

        <div className="search-input-wrapper" style={{ maxWidth: '380px' }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search leads, units, customers, bills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: '20px', paddingLeft: '38px', height: '38px' }}
          />
        </div>
      </div>

      {/* Right: Role Switcher, Notifications, User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Role Switcher Pill */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '20px', gap: '6px' }}
          >
            <RefreshCw size={14} />
            <span>Switch Role: <strong style={{ color: 'var(--primary)' }}>{user?.role}</strong></span>
          </button>

          {showRoleDropdown && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '45px',
              width: '240px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '8px',
              zIndex: 200
            }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', padding: '6px 10px', textTransform: 'uppercase' }}>
                Test Role Views
              </p>
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => handleSwitchRole(acc)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    backgroundColor: user?.role === acc.role ? 'var(--primary-light)' : 'transparent',
                    color: user?.role === acc.role ? 'var(--primary)' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  <span>{acc.role}</span>
                  {user?.role === acc.role && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-icon btn-secondary"
            style={{ position: 'relative' }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: 'var(--danger)',
                color: '#FFF',
                fontSize: '10px',
                fontWeight: '700',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '45px',
              width: '320px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 200,
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700' }}>Notifications</h4>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} style={{ fontSize: '12px', color: 'var(--primary)', background: 'none' }}>
                    Mark all read
                  </button>
                )}
              </div>

              <div>
                {notifications.length === 0 ? (
                  <p style={{ padding: '16px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n._id} 
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--border)',
                        backgroundColor: n.isRead ? 'transparent' : 'var(--primary-light)',
                        fontSize: '13px'
                      }}
                    >
                      <p style={{ fontWeight: '700', color: 'var(--text-main)' }}>{n.title}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', borderLeft: '1px solid var(--border)' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '14px'
          }}>
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', lineHeight: 1.2 }}>{user?.name || 'User'}</span>
            <span className="badge badge-secondary" style={{ fontSize: '10px', padding: '1px 6px', marginTop: '2px', width: 'fit-content' }}>
              {user?.role}
            </span>
          </div>

          <button
            onClick={logout}
            className="btn-icon btn-secondary"
            title="Logout"
            style={{ marginLeft: '8px', color: 'var(--danger)' }}
          >
            <LogOut size={18} />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
