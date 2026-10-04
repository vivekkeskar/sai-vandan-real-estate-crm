import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'var(--primary)', bg = 'var(--primary-light)', subtitle }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
      <div>
        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>{title}</p>
        <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>{value}</h3>
        {subtitle && <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '4px' }}>{subtitle}</p>}
      </div>
      {Icon && (
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: bg,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
