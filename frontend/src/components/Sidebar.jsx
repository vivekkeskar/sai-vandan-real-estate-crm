import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCheck, Building2, CalendarCheck, BookOpenCheck, 
  CreditCard, FileText, Landmark, FileCheck, KeyRound, Headset, UserCircle, 
  Banknote, Truck, ShoppingCart, Wallet, PieChart, BarChart3, Settings, Building
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useContext(AuthContext);

  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Sales Executive', 'HR', 'Accounts', 'Manager', 'Employee'] },
    { title: 'Leads', path: '/leads', icon: Users, roles: ['Admin', 'Sales Executive', 'Manager'] },
    { title: 'Customers', path: '/customers', icon: UserCheck, roles: ['Admin', 'Sales Executive', 'Manager'] },
    { title: 'Properties', path: '/properties', icon: Building2, roles: ['Admin', 'Sales Executive', 'Manager', 'Accounts'] },
    { title: 'Site Visits', path: '/site-visits', icon: CalendarCheck, roles: ['Admin', 'Sales Executive', 'Manager'] },
    { title: 'Bookings', path: '/bookings', icon: BookOpenCheck, roles: ['Admin', 'Sales Executive', 'Manager', 'Accounts'] },
    { title: 'Payments', path: '/payments', icon: CreditCard, roles: ['Admin', 'Accounts', 'Manager'] },
    { title: 'Documents', path: '/documents', icon: FileText, roles: ['Admin', 'Sales Executive', 'Accounts', 'Manager'] },
    { title: 'Loans', path: '/loans', icon: Landmark, roles: ['Admin', 'Sales Executive', 'Accounts', 'Manager'] },
    { title: 'Agreements', path: '/agreements', icon: FileCheck, roles: ['Admin', 'Sales Executive', 'Accounts', 'Manager'] },
    { title: 'Possession', path: '/possession', icon: KeyRound, roles: ['Admin', 'Sales Executive', 'Manager'] },
    { title: 'Customer Support', path: '/support', icon: Headset, roles: ['Admin', 'Sales Executive', 'Employee', 'Manager'] },
    { title: 'Employees', path: '/employees', icon: UserCircle, roles: ['Admin', 'HR', 'Manager'] },
    { title: 'Payroll', path: '/payroll', icon: Banknote, roles: ['Admin', 'HR', 'Accounts', 'Manager'] },
    { title: 'Vendors', path: '/vendors', icon: Truck, roles: ['Admin', 'Accounts', 'Manager'] },
    { title: 'Purchases', path: '/purchases', icon: ShoppingCart, roles: ['Admin', 'Accounts', 'Manager'] },
    { title: 'Petty Cash', path: '/petty-cash', icon: Wallet, roles: ['Admin', 'Accounts', 'Manager'] },
    { title: 'Finance', path: '/finance', icon: PieChart, roles: ['Admin', 'Accounts', 'Manager'] },
    { title: 'Reports', path: '/reports', icon: BarChart3, roles: ['Admin', 'Manager', 'Accounts', 'HR', 'Sales Executive'] },
    { title: 'Settings', path: '/settings', icon: Settings, roles: ['Admin', 'Manager'] }
  ];

  const allowedItems = menuItems.filter(item => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    return item.roles.includes(user.role);
  });

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--bg-sidebar)',
      color: 'var(--text-white)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-md)',
      transition: 'transform 0.3s ease'
    }}>
      {/* Brand Logo Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border-dark)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF'
        }}>
          <Building size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '-0.3px', lineHeight: 1.2 }}>SAI VANDAN</h1>
          <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', letterSpacing: '0.5px' }}>COMPLEX CRM</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{
        flex: 1,
        padding: '16px 12px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {allowedItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#FFFFFF' : '#94A3B8',
                backgroundColor: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                transition: 'all 0.2s ease',
                textDecoration: 'none'
              })}
              onClick={() => window.innerWidth <= 1024 && toggleSidebar()}
            >
              <Icon size={18} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Client Info */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border-dark)',
        fontSize: '12px',
        color: '#64748B'
      }}>
        <p style={{ fontWeight: '600', color: '#94A3B8' }}>Client: Mrs. Snehal Kulkarni</p>
        <p style={{ fontSize: '11px' }}>Baner, Pune • v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
