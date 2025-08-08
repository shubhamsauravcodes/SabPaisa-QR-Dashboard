import { useState } from 'react';
import { formatDisplayDate, deserializeDate } from '../utils/dateUtils';
import type { Transaction } from '../types';

// Safe array function to ensure transactions is always an array
const ensureArray = (arr: unknown): Transaction[] => Array.isArray(arr) ? arr : [];

const PaymentFeed = ({ transactions: rawTransactions }: { transactions: Transaction[] }) => {
  // Ensure transactions is always an array
  const transactions = ensureArray(rawTransactions);
  const [filterQrId, setFilterQrId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAmountRange, setFilterAmountRange] = useState('');
  const [filterUtr, setFilterUtr] = useState('');
  const [filterCustomerInfo, setFilterCustomerInfo] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const filteredTransactions = transactions.filter((txn) => {
    const matchesQrId = filterQrId === '' || txn.qrId.toLowerCase().includes(filterQrId.toLowerCase());
    const matchesStatus = filterStatus === '' || txn.status === filterStatus;
    const matchesAmount = filterAmountRange === '' || 
      (filterAmountRange === '0-100' && txn.amount <= 100) ||
      (filterAmountRange === '101-500' && txn.amount > 100 && txn.amount <= 500) ||
      (filterAmountRange === '501-1000' && txn.amount > 500 && txn.amount <= 1000) ||
      (filterAmountRange === '1000+' && txn.amount > 1000);
    const matchesUtr = filterUtr === '' || txn.utr.toLowerCase().includes(filterUtr.toLowerCase());
    const matchesCustomerInfo = filterCustomerInfo === '' || 
      txn.customerInfo.name.toLowerCase().includes(filterCustomerInfo.toLowerCase()) ||
      txn.customerInfo.phone.includes(filterCustomerInfo);
    
    // Date range filtering
    let matchesDate = true;
    if (filterDateFrom || filterDateTo) {
      const txnDate = deserializeDate(txn.timestamp);
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        matchesDate = matchesDate && txnDate >= fromDate;
      }
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        matchesDate = matchesDate && txnDate <= toDate;
      }
    }
    
    return matchesQrId && matchesStatus && matchesAmount && matchesUtr && matchesCustomerInfo && matchesDate;
  });

  const formatDate = (dateString) => {
    return formatDisplayDate(dateString);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success': return '#4caf50';
      case 'Failed': return '#f44336';
      case 'Pending': return '#ff9800';
      default: return '#666';
    }
  };

  const clearAllFilters = () => {
    setFilterQrId('');
    setFilterStatus('');
    setFilterAmountRange('');
    setFilterUtr('');
    setFilterCustomerInfo('');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 24px 0 24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#333' }}>
          Payment Transactions
        </h3>
        
        {/* Filters Row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Filter by QR ID"
            value={filterQrId}
            onChange={(e) => setFilterQrId(e.target.value)}
            style={{ 
              padding: '12px 16px', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              fontSize: '14px',
              background: 'white',
              minWidth: '150px',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2196f3'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ 
              padding: '12px 16px', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              fontSize: '14px',
              background: 'white',
              minWidth: '120px',
              cursor: 'pointer'
            }}
          >
            <option value="">All Status</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </select>
          <select 
            value={filterAmountRange} 
            onChange={(e) => setFilterAmountRange(e.target.value)}
            style={{ 
              padding: '12px 16px', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              fontSize: '14px',
              background: 'white',
              minWidth: '130px',
              cursor: 'pointer'
            }}
          >
            <option value="">All Amounts</option>
            <option value="0-100">₹0 - ₹100</option>
            <option value="101-500">₹101 - ₹500</option>
            <option value="501-1000">₹501 - ₹1000</option>
            <option value="1000+">₹1000+</option>
          </select>
          <input
            type="text"
            placeholder="Filter by UTR"
            value={filterUtr}
            onChange={(e) => setFilterUtr(e.target.value)}
            style={{ 
              padding: '12px 16px', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              fontSize: '14px',
              background: 'white',
              minWidth: '150px',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2196f3'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          <input
            type="text"
            placeholder="Filter by Customer Name/Phone"
            value={filterCustomerInfo}
            onChange={(e) => setFilterCustomerInfo(e.target.value)}
            style={{ 
              padding: '12px 16px', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              fontSize: '14px',
              background: 'white',
              minWidth: '180px',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2196f3'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            style={{ 
              padding: '12px 16px', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              fontSize: '14px',
              background: 'white',
              minWidth: '130px'
            }}
          />
          <span style={{ fontWeight: '600', color: '#666' }}>to</span>
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            style={{ 
              padding: '12px 16px', 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px', 
              fontSize: '14px',
              background: 'white',
              minWidth: '130px'
            }}
          />
          <button 
            onClick={clearAllFilters}
            style={{ 
              padding: '12px 16px', 
              background: '#666', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#555'}
            onMouseOut={(e) => e.currentTarget.style.background = '#666'}
          >
            Clear All Filters
          </button>
        </div>
        
        {/* Filter results count - only show when filters are active */}
        {(filterQrId || filterStatus || filterAmountRange || filterUtr || filterCustomerInfo || filterDateFrom || filterDateTo) && (
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px', fontStyle: 'italic' }}>
            📋 Filtered: Showing {filteredTransactions.length} of {transactions.length} transactions on this page
          </div>
        )}
      </div>

      {/* Scrollable Transactions Table */}
      <div style={{ flex: 1, overflow: 'auto', borderTop: '1px solid #e0e0e0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 5 }}>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '1px solid #e0e0e0' }}>Payment ID</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '1px solid #e0e0e0' }}>QR ID</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '1px solid #e0e0e0' }}>Amount</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '1px solid #e0e0e0' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '1px solid #e0e0e0' }}>UTR</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '1px solid #e0e0e0' }}>Customer</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '1px solid #e0e0e0' }}>UPI App</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '1px solid #e0e0e0' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn) => (
              <tr key={txn.paymentId} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{txn.paymentId}</td>
                <td style={{ padding: '16px', fontWeight: '600', color: '#333' }}>{txn.qrId}</td>
                <td style={{ padding: '16px', fontWeight: '600', color: '#2e7d32' }}>₹{txn.amount.toLocaleString()}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    color: getStatusColor(txn.status), 
                    fontWeight: '600',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    backgroundColor: getStatusColor(txn.status) === '#4caf50' ? '#e8f5e8' : 
                                   getStatusColor(txn.status) === '#f44336' ? '#ffebee' : '#fff3e0'
                  }}>
                    {txn.status}
                  </span>
                </td>
                <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{txn.utr}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: '600', color: '#333' }}>{txn.customerInfo.name}</div>
                  <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>{txn.customerInfo.phone}</div>
                </td>
                <td style={{ padding: '16px', fontWeight: '600', color: '#333' }}>{txn.customerInfo.upiApp}</td>
                <td style={{ padding: '16px', fontSize: '12px', color: '#666' }}>{formatDate(txn.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredTransactions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: '#666', fontSize: '16px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            No transactions found matching the current filters
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentFeed; 