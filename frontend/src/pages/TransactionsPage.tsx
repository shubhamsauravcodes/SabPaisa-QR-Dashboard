import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { useSafeTransactions } from '../store/safeHooks';
import { fetchTransactions, addTransactions } from '../store/slices/transactionsSlice';
import PaymentFeed from '../components/PaymentFeed';
import { simulatePayment } from '../utils/paymentSimulator';
import Header from '../components/Header';

const TransactionsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const qrId = searchParams.get('qrId');
  const [lastRefresh, setLastRefresh] = useState(new Date().toISOString());

  // Redux state with safe hook
  const transactions = useSafeTransactions();

  const filteredTransactions = qrId 
    ? transactions.filter((txn) => txn.qrId === qrId)
    : transactions;

  const pageTitle = qrId 
    ? `Transactions for QR: ${qrId}`
    : 'All Transactions';

  // Load transaction data on component mount and when qrId changes
  useEffect(() => {
    const params = qrId ? { qrId } : {};
    console.log('📊 TransactionsPage: Fetching transactions with params:', params);
    dispatch(fetchTransactions(params));
  }, [dispatch, qrId]);

  // Auto-refresh mechanism - generate new transactions every 30 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // Generate 2-5 random transactions for variety
      const numTransactions = Math.floor(Math.random() * 4) + 2;
      const newTransactions = [];
      
      if (qrId) {
        for (let i = 0; i < numTransactions; i++) {
          const newTransaction = simulatePayment(qrId, '10000');
          newTransactions.push(newTransaction);
        }
      }
      
      dispatch(addTransactions(newTransactions));
      setLastRefresh(new Date().toISOString());
    }, 30000); // Every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [qrId, dispatch]);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  // Calculate summary amounts
  const totalAmount = filteredTransactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);
  const successAmount = filteredTransactions.filter(txn => txn.status === 'Success').reduce((sum, txn) => sum + (txn.amount || 0), 0);
  const failureAmount = filteredTransactions.filter(txn => txn.status === 'Failed').reduce((sum, txn) => sum + (txn.amount || 0), 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Header 
          title={pageTitle}
          subtitle={`Total Transactions: ${filteredTransactions.length} | Last refreshed: ${formatTime(lastRefresh)} | Auto-refresh every 30 seconds`}
          showBackButton={true}
        />

        {/* Transaction Summary */}
        <div style={{
          display: 'flex',
          gap: '32px',
          margin: '32px 0 16px 0',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
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
          <PaymentFeed transactions={filteredTransactions} />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage; 