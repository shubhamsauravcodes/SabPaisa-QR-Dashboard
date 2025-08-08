import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { useSafeTransactions } from '../store/safeHooks';
import { fetchTransactions } from '../store/slices/transactionsSlice';
import { transactionApi } from '../services/api';
import PaymentFeed from '../components/PaymentFeed';
import Header from '../components/Header';
import Paginator from '../components/Paginator';

const TransactionsPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const qrId = searchParams.get('qrId');
  const [lastRefresh, setLastRefresh] = useState(new Date().toISOString());
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalRecords: 0,
    hasNext: false,
    hasPrev: false,
    pageSize: 20
  });
  const [loading, setLoading] = useState(false);

  // Redux state with safe hook - these are already paginated from the API
  const transactions = useSafeTransactions();

  // No need to filter here since the backend already handles qrId filtering
  // and returns only the current page's transactions
  const displayTransactions = transactions;

  const pageTitle = qrId 
    ? `Transactions for QR: ${qrId}`
    : 'All Transactions';

  // Function to fetch transactions with pagination
  const fetchTransactionsData = useCallback(async (page = 1, limit = 20) => {
    setLoading(true);
    const params = {
      ...(qrId ? { qrId } : {}),
      page,
      limit
    };
    
    console.log('📊 TransactionsPage: Fetching transactions with params:', params);
    
    try {
      const response = await dispatch(fetchTransactions(params)).unwrap();
      console.log('📊 API Response:', response);
      
      const paginationData = response?.data?.pagination;
      console.log('📊 Pagination Data:', paginationData);
      
      if (paginationData) {
        const pageSize = 20; // Default page size
        const totalPages = Math.ceil(paginationData.totalRecords / pageSize);
        const currentPage = paginationData.current || 1;
        const updatedPagination = {
          current: currentPage,
          total: totalPages || 1,
          count: paginationData.count || 0,
          totalRecords: paginationData.totalRecords || 0,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1,
          pageSize: pageSize
        };
        console.log('📊 Updated Pagination:', updatedPagination);
        setPagination(updatedPagination);
        setCurrentPage(currentPage);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, qrId]);

  // Load transaction data on component mount and when qrId changes
  useEffect(() => {
    fetchTransactionsData(1, 20); // Reset to page 1 when qrId changes
  }, [fetchTransactionsData]);

  // Page change handler
  const handlePageChange = (page: number) => {
    fetchTransactionsData(page, pagination.pageSize);
  };

  // Handle CSV Export
  const handleExportCSV = async () => {
    try {
      const csvUrl = await transactionApi.exportCSV({
        ...(qrId ? { qrId } : {}),
        // Include additional parameters like status, startDate, endDate if needed
      });
      window.open(csvUrl, '_blank');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    }
  };

  // Auto-refresh mechanism - refresh current page every 30 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing transactions page...');
      fetchTransactionsData(currentPage, pagination.pageSize);
      setLastRefresh(new Date().toISOString());
    }, 30000); // Every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [currentPage, pagination.pageSize, fetchTransactionsData]);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  // Calculate summary amounts for current page only
  const totalAmount = displayTransactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);
  const successAmount = displayTransactions.filter(txn => txn.status === 'Success').reduce((sum, txn) => sum + (txn.amount || 0), 0);
  const failureAmount = displayTransactions.filter(txn => txn.status === 'Failed').reduce((sum, txn) => sum + (txn.amount || 0), 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Header 
          title={pageTitle}
          subtitle={`Total Transactions: ${pagination.totalRecords} | Page ${pagination.current} of ${pagination.total} | Last refreshed: ${formatTime(lastRefresh)}`}
          showBackButton={true}
        />

        {/* Transaction Summary */}
        <div style={{
          display: 'flex',
          gap: '32px',
          margin: '32px 0 16px 0',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{
            background: '#f5f7fa',
            borderRadius: '12px',
            padding: '18px 32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            minWidth: '220px',
            fontWeight: 600,
            color: '#333',
            fontSize: '1.1rem',
          }}>
            Total Amount<br />
            <span style={{ fontSize: '1.5rem', color: '#4f46e5' }}>₹ {totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div style={{
            background: '#e6fffa',
            borderRadius: '12px',
            padding: '18px 32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            minWidth: '220px',
            fontWeight: 600,
            color: '#065f46',
            fontSize: '1.1rem',
          }}>
            Success Amount<br />
            <span style={{ fontSize: '1.5rem', color: '#059669' }}>₹ {successAmount.toLocaleString('en-IN')}</span>
          </div>
          <div style={{
            background: '#fff5f5',
            borderRadius: '12px',
            padding: '18px 32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            minWidth: '220px',
            fontWeight: 600,
            color: '#b91c1c',
            fontSize: '1.1rem',
          }}>
            Failure Amount<br />
            <span style={{ fontSize: '1.5rem', color: '#dc2626' }}>₹ {failureAmount.toLocaleString('en-IN')}</span>
          </div>
          
          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 24px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '180px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.3)';
            }}
          >
            <span>📊</span>
            Export CSV
            {qrId && <span style={{ fontSize: '12px', opacity: 0.9 }}>({qrId})</span>}
          </button>
        </div>

        {/* Transaction Content */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#666',
              fontSize: '16px'
            }}>
              <div style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '10px'
              }}></div>
              Loading transactions...
            </div>
          ) : (
            <>
              <PaymentFeed transactions={displayTransactions} />
              <Paginator
                currentPage={pagination.current}
                totalPages={pagination.total}
                totalRecords={pagination.totalRecords}
                pageSize={pagination.pageSize}
                hasNext={pagination.hasNext}
                hasPrev={pagination.hasPrev}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
        
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default TransactionsPage; 