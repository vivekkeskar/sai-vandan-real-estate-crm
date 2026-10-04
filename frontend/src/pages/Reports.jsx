import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Printer, Search, Filter } from 'lucide-react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('leads');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useNotification();

  const reportTypes = [
    { id: 'leads', name: 'Lead Enquiry Report' },
    { id: 'sales', name: 'Sales & Revenue Report' },
    { id: 'bookings', name: 'Property Booking Report' },
    { id: 'properties', name: 'Property Availability Report' },
    { id: 'payments', name: 'Customer Payment Report' },
    { id: 'pending-payments', name: 'Pending Receivables Report' },
    { id: 'site-visits', name: 'Site Visit Audit Report' },
    { id: 'employees', name: 'Employee Directory Report' },
    { id: 'payroll', name: 'Monthly Payroll Report' },
    { id: 'vendors', name: 'Vendor Directory Report' },
    { id: 'vendor-outstanding', name: 'Vendor Outstanding Report' },
    { id: 'purchases', name: 'Purchase Order Summary' },
    { id: 'petty-cash', name: 'Petty Cash Book Audit' }
  ];

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/reports/${selectedReport}`);
      setReportData(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedReport]);

  const exportToCSV = () => {
    if (!reportData || reportData.length === 0) {
      addToast('No data available to export', 'error');
      return;
    }
    const headers = Object.keys(reportData[0]).filter(k => k !== '__v' && k !== '_id').join(',');
    const rows = reportData.map(row => 
      Object.keys(row)
        .filter(k => k !== '__v' && k !== '_id')
        .map(k => `"${String(row[k] || '').replace(/"/g, '""')}"`)
        .join(',')
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sai_Vandan_${selectedReport}_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(`Exported ${selectedReport} report to CSV successfully!`, 'success');
  };

  const filteredData = reportData.filter(item => {
    if (!search) return true;
    return JSON.stringify(item).toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Management Reports & Analytics</h1>
          <p className="page-subtitle">Generate exportable audit reports for Sales, Payments, Inventory & Payroll</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={exportToCSV} className="btn btn-primary" style={{ gap: '6px' }}>
            <Download size={16} /> Export to CSV
          </button>
          <button onClick={() => window.print()} className="btn btn-secondary" style={{ gap: '6px' }}>
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
        {reportTypes.map(r => (
          <button
            key={r.id}
            onClick={() => setSelectedReport(r.id)}
            className={`btn ${selectedReport === r.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper" style={{ maxWidth: '320px' }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search within report dataset..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
          Total Records: {filteredData.length}
        </div>
      </div>

      {/* Report Dynamic Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}><div className="loading-spinner"></div></div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3>No Records Available for This Report</h3>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {Object.keys(filteredData[0])
                  .filter(k => k !== '__v' && k !== '_id' && k !== 'createdAt' && k !== 'updatedAt')
                  .map(key => (
                    <th key={key} style={{ textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={idx}>
                  {Object.keys(row)
                    .filter(k => k !== '__v' && k !== '_id' && k !== 'createdAt' && k !== 'updatedAt')
                    .map(key => {
                      const val = row[key];
                      if (typeof val === 'object' && val !== null) {
                        return <td key={key}>{val.name || val.unitNumber || JSON.stringify(val)}</td>;
                      }
                      if (typeof val === 'number' && (key.toLowerCase().includes('price') || key.toLowerCase().includes('amount') || key.toLowerCase().includes('budget') || key.toLowerCase().includes('salary')) ) {
                        return <td key={key} style={{ fontWeight: '700' }}>₹{val.toLocaleString()}</td>;
                      }
                      return <td key={key}>{String(val ?? '-')}</td>;
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default Reports;
