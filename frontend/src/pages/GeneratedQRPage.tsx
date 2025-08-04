import React, { useState, useMemo, useEffect } from 'react';
import { simulatePayment } from '../utils/paymentSimulator';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { useSafeQRCodes, useSafeTransactions, useFilteredQRCodes } from '../store/safeHooks';
import { replaceQRCodes, toggleQRStatus, toggleSimulation } from '../store/slices/qrCodesSlice';
import { qrApi, simulationApi, transactionApi } from '../services/api';
import QRCode from 'react-qr-code';
import QRGenerationModal from '../components/QRGenerationModal';
import Modal from '../components/Modal';
import QRCodeCard from '../components/QRCodeCard';
import Header from '../components/Header';
import type { QRCode as QRCodeType, Transaction } from '../types';

const GeneratedQRPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const qrCodes = useSafeQRCodes();
  const transactions = useSafeTransactions();

  const [filterId, setFilterId] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editInitialData, setEditInitialData] = useState<any>({});
  const [showCardIdx, setShowCardIdx] = useState<number | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null); // Track which QR is being toggled
  const [statusToggleLoading, setStatusToggleLoading] = useState<string | null>(null); // Track which QR status is being toggled
  const [loading, setLoading] = useState(false);

  // Function to refresh QR data from backend
  const refreshData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching QR codes from API...');
      const response = await qrApi.getAll({ limit: 1000 }); // Get all QR codes
      console.log('📡 Raw API Response:', response);
      console.log('🔍 Response structure analysis:');
      console.log('  - response type:', typeof response);
      console.log('  - response.data type:', typeof response.data);
      console.log('  - response.data:', response.data);
      if (response.data) {
        console.log('  - response.data.qrCodes type:', typeof response.data.qrCodes);
        console.log('  - response.data.qrCodes:', response.data.qrCodes);
        console.log('  - response.data.qrCodes is array:', Array.isArray(response.data.qrCodes));
        console.log('  - Object.keys(response.data):', Object.keys(response.data));
      }
      
      // Extract QR codes from the nested response structure
      let qrCodesData;
      if (response.data && response.data.qrCodes && Array.isArray(response.data.qrCodes)) {
        qrCodesData = response.data.qrCodes;
      } else if (Array.isArray(response.data)) {
        qrCodesData = response.data;
      } else {
        qrCodesData = [];
      }
      
      console.log('📊 Extracted QR Codes Data:', qrCodesData);
      console.log('📊 Data type:', typeof qrCodesData);
      console.log('📊 Is Array:', Array.isArray(qrCodesData));
      
      // Ensure we have an array
      const qrArray = Array.isArray(qrCodesData) ? qrCodesData : [];
      console.log('🔢 Number of QR codes found:', qrArray.length);
      
      // Log each QR code for debugging
      if (qrArray.length > 0) {
        qrArray.forEach((qr, index) => {
          console.log(`QR ${index + 1}:`, {
            qrId: qr.qrId,
            referenceName: qr.referenceName,
            status: qr.status,
            category: qr.category
          });
        });
      } else {
        console.log('⚠️ No QR codes found in response');
      }
      
      dispatch(replaceQRCodes(qrArray));
      console.log('✅ QR data refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh QR data:', error);
    } finally {
      setLoading(false);
    }
  };

  // State to store transaction counts per QR code
  const [qrTransactionCounts, setQrTransactionCounts] = useState<Record<string, number>>({});

  // Function to fetch transaction counts for all QR codes
  const refreshTransactionCounts = async () => {
    try {
      console.log('🔍 Fetching transaction counts from API...');
      const counts: Record<string, number> = {};
      
      // Fetch transaction count for each QR code using the stats API
      for (const qr of qrCodes) {
        try {
          const response = await transactionApi.getAll({ qrId: qr.qrId, limit: 1 }); // Just get pagination metadata
          const totalRecords = response.data?.pagination?.totalRecords || 0;
          counts[qr.qrId] = totalRecords;
          console.log(`📊 QR ${qr.qrId}: ${totalRecords} transactions`);
        } catch (error) {
          console.error(`❌ Failed to get count for QR ${qr.qrId}:`, error);
          counts[qr.qrId] = 0;
        }
      }
      
      setQrTransactionCounts(counts);
      console.log('✅ Transaction counts refreshed successfully:', counts);
    } catch (error) {
      console.error('❌ Failed to refresh transaction counts:', error);
    }
  };

  // Load QR data and transaction counts on component mount
  useEffect(() => {
    refreshData();
  }, []);

  // Load transaction counts when QR codes change
  useEffect(() => {
    if (qrCodes.length > 0) {
      refreshTransactionCounts();
    }
  }, [qrCodes]);

  // Frontend simulation disabled - transactions should come from backend simulation service
  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     qrCodes.forEach(qr => {
  //       if (qr.simulationActive && qr.status === 'Active') {
  //         const txn = simulatePayment(qr.qrId, qr.maxAmount);
  //         dispatch({
  //           type: 'transactions/addTransaction',
  //           payload: txn
  //         });
  //       }
  //     });
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [qrCodes, dispatch]);

  const categories = [
    'Retail', 'Rental', 'Education', 'Custom'
  ];

  const filteredQRCodes = useFilteredQRCodes({
    id: filterId,
    name: filterName,
    category: filterCategory,
    status: filterStatus
  });

  const handleCreateQR = async (data: { qrId: string; vpa: string; referenceName: string; description?: string; maxAmount?: string; category?: string; notes?: string }) => {
    try {
        console.log('Creating QR code with data:', data);
        const payload = {
            ...data,
            category: data.category || 'Other', // Ensure category is always a string
        };

        const response = await qrApi.create(payload);
        console.log('API Response:', response);

        if (!response.data) {
            throw new Error('Failed to create QR code: No data returned');
        }

        setModalOpen(false);
        // Refresh the data to show the new QR code
        await refreshData();
        console.log('QR code created successfully');
    } catch (err) {
        const error = err as { response?: { data?: { message?: string }; status?: number }; request?: XMLHttpRequest; message?: string };
        console.error('Failed to create QR code:', error);

        let errorMessage = 'Unknown error occurred';
        if (error.response) {
            errorMessage = error.response.data?.message || `Server Error: ${error.response.status}`;
        } else if (error.request) {
            errorMessage = 'Network Error: No response received from the server';
        } else {
            errorMessage = error.message || 'An unexpected error occurred';
        }

        alert(`Failed to create QR code: ${errorMessage}`);
    }
  };

  const handleEditQR = async (data: { referenceName: string; description?: string; maxAmount?: string; category?: string; notes?: string }) => {
    if (editIdx !== null) {
      try {
        const qrId = qrCodes[editIdx].qrId;
        await qrApi.update(qrId, {
          referenceName: data.referenceName,
          description: data.description || '',
          maxAmount: data.maxAmount || '0',
          category: data.category || 'Other',
          notes: data.notes || ''
        });
        setEditIdx(null);
        setEditInitialData({});
        // Refresh the data to show updated QR code
        await refreshData();
        console.log('QR code updated successfully');
      } catch (err) {
        const error = err as { response?: { data?: { message?: string }; status?: number }; request?: XMLHttpRequest; message?: string };
        console.error('Failed to update QR code:', error);

        let errorMessage = 'Unknown error occurred';
        if (error.response) {
            errorMessage = error.response.data?.message || `Server Error: ${error.response.status}`;
        } else if (error.request) {
            errorMessage = 'Network Error: No response received from the server';
        } else {
            errorMessage = error.message || 'An unexpected error occurred';
        }

        alert(`Failed to update QR code: ${errorMessage}`);
      }
    }
  };

  const handleToggleStatus = async (idx: number) => {
    const qrId = qrCodes[idx].qrId;
    const currentStatus = qrCodes[idx].status;
    
    setStatusToggleLoading(qrId); // Set loading state
    
    try {
      console.log(`🔄 Toggling QR status from ${currentStatus} for QR ID: ${qrId}`);
      const response = await qrApi.toggleStatus(qrId);
      console.log('🎉 QR status toggle response:', response);
      
      // Refresh the data to show updated status
      await refreshData();
      
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      console.log(`✅ QR code status toggled successfully: ${currentStatus} → ${newStatus}`);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string }; status?: number }; request?: XMLHttpRequest; message?: string };
      console.error('❌ Failed to toggle QR status:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error.response) {
        errorMessage = error.response.data?.message || `Server Error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network Error: No response received from the server';
      } else {
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      alert(`Failed to toggle QR status: ${errorMessage}`);
    } finally {
      setStatusToggleLoading(null); // Clear loading state
    }
  };

  const toggleQrSimulation = async (idx: number) => {
    const qrId = qrCodes[idx].qrId;
    const currentStatus = qrCodes[idx].simulationActive;

    setToggleLoading(qrId); // Set loading state

    try {
        // Call the API to toggle simulation
        await simulationApi.toggleSimulation(qrId);
        
        // Refresh the data to ensure UI updates
        await refreshData();

        console.log(`🎉 QR code simulation ${!currentStatus ? 'started' : 'stopped'} successfully`);
    } catch (err) {
        const error = err as { response?: { data?: { message?: string }; status?: number }; request?: XMLHttpRequest; message?: string };
        console.error('❌ Failed to toggle simulation:', error);

        let errorMessage = 'Unknown error occurred';
        if (error.response) {
            // Server responded with a status code outside the 2xx range
            errorMessage = error.response.data?.message || `Server Error: ${error.response.status}`;
        } else if (error.request) {
            // Request was made but no response received
            errorMessage = 'Network Error: No response received from the server';
        } else {
            // Something happened in setting up the request
            errorMessage = error.message || 'An unexpected error occurred';
        }

        alert(`Failed to ${currentStatus ? 'stop' : 'start'} simulation: ${errorMessage}`);
    } finally {
        setToggleLoading(null); // Clear loading state
    }
  };

  const handleDeleteQRById = async (idx: number) => {
    if (window.confirm('Are you sure you want to delete this QR code?')) {
      const qrId = qrCodes[idx].qrId;
      try {
        await qrApi.delete(qrId);
        // Refresh the data to remove deleted QR code
        await refreshData();
        console.log('QR code deleted successfully');
      } catch (error) {
        console.error('Failed to delete QR code:', error);
      }
    }
  };

  const handleViewQrTransactions = (qrId: string) => {
    navigate(`/transactions?qrId=${qrId}`);
  };

  return (
    <>
      <div style={{
        minHeight: '32vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Header 
            title="Generated QR Codes" 
            subtitle="Manage and monitor all your QR codes"
            showBackButton={true}
          />

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'flex-end' }}>
            <button onClick={() => setModalOpen(true)} style={{ background: '#4caf50', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}>
              + Generate QR Code
            </button>
            <button onClick={() => navigate('/transactions')} style={{ background: '#2196f3', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}>
              View Transactions
            </button>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', padding: '32px 24px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '24px 24px 0 24px' }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Filter QR Codes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '8px' }}>
              <input 
                placeholder="Filter by QR ID" 
                value={filterId} 
                onChange={e => setFilterId(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px',
                  background: '#f8fafc',
                  transition: 'border 0.2s, box-shadow 0.2s',
                  outline: 'none',
                  boxShadow: '0 1px 4px rgba(102,126,234,0.04)',
                  fontWeight: 500,
                }}
                onFocus={e => e.currentTarget.style.border = '2px solid #6366f1'}
                onBlur={e => e.currentTarget.style.border = '2px solid #e5e7eb'}
              />
              <input 
                placeholder="Filter by Name" 
                value={filterName} 
                onChange={e => setFilterName(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px',
                  background: '#f8fafc',
                  transition: 'border 0.2s, box-shadow 0.2s',
                  outline: 'none',
                  boxShadow: '0 1px 4px rgba(102,126,234,0.04)',
                  fontWeight: 500,
                }}
                onFocus={e => e.currentTarget.style.border = '2px solid #6366f1'}
                onBlur={e => e.currentTarget.style.border = '2px solid #e5e7eb'}
              />
              <select 
                value={filterCategory} 
                onChange={e => setFilterCategory(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px',
                  background: '#f8fafc',
                  fontWeight: 500,
                  color: filterCategory ? '#333' : '#888',
                  transition: 'border 0.2s',
                  outline: 'none',
                  boxShadow: '0 1px 4px rgba(102,126,234,0.04)',
                }}
                onFocus={e => e.currentTarget.style.border = '2px solid #6366f1'}
                onBlur={e => e.currentTarget.style.border = '2px solid #e5e7eb'}
              >
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select 
                value={filterStatus} 
                onChange={e => setFilterStatus(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px',
                  background: '#f8fafc',
                  fontWeight: 500,
                  color: filterStatus ? '#333' : '#888',
                  transition: 'border 0.2s',
                  outline: 'none',
                  boxShadow: '0 1px 4px rgba(102,126,234,0.04)',
                }}
                onFocus={e => e.currentTarget.style.border = '2px solid #6366f1'}
                onBlur={e => e.currentTarget.style.border = '2px solid #e5e7eb'}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div style={{
              marginTop: '14px',
              marginBottom: '8px',
              background: 'linear-gradient(90deg, #e0e7ff 0%, #f0fdfa 100%)',
              color: '#3730a3',
              fontWeight: 600,
              fontSize: '1.05rem',
              borderRadius: '8px',
              padding: '10px 18px',
              boxShadow: '0 1px 6px rgba(102,126,234,0.07)',
              display: 'inline-block',
              letterSpacing: '0.01em',
            }}>
              Showing <span style={{ color: '#4f46e5', fontWeight: 700 }}>{filteredQRCodes.length}</span> of <span style={{ color: '#059669', fontWeight: 700 }}>{qrCodes.length}</span> QR codes
            </div>
          </div>

          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}>
                  <th style={{
                    padding: '14px 12px',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    letterSpacing: '0.03em',
                    borderTopLeftRadius: '12px',
                    borderBottom: '2.5px solid #a5b4fc',
                    borderRight: '2px solid #a5b4fc',
                    textAlign: 'center',
                  }}>QR Code</th>
                  <th style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.03em', borderBottom: '2.5px solid #a5b4fc', borderRight: '2px solid #a5b4fc', textAlign: 'center' }}>QR ID</th>
                  <th style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.03em', borderBottom: '2.5px solid #a5b4fc', borderRight: '2px solid #a5b4fc', textAlign: 'center' }}>Name</th>
                  <th style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.03em', borderBottom: '2.5px solid #a5b4fc', borderRight: '2px solid #a5b4fc', textAlign: 'center' }}>VPA</th>
                  <th style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.03em', borderBottom: '2.5px solid #a5b4fc', borderRight: '2px solid #a5b4fc', textAlign: 'center' }}>Category</th>
                  <th style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.03em', borderBottom: '2.5px solid #a5b4fc', borderRight: '2px solid #a5b4fc', textAlign: 'center' }}>Amount</th>
                  <th style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.03em', borderBottom: '2.5px solid #a5b4fc', borderRight: '2px solid #a5b4fc', textAlign: 'center' }}>Status</th>
                  <th style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.03em', borderBottom: '2.5px solid #a5b4fc', borderRight: '2px solid #a5b4fc', textAlign: 'center' }}>Actions</th>
                  <th style={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    letterSpacing: '0.03em',
                    borderTopRightRadius: '12px',
                    borderBottom: '2.5px solid #a5b4fc',
                    textAlign: 'center',
                  }}>Manage</th>
                </tr>
              </thead>
              {/* <tbody>
                {filteredQRCodes.map((qr, idx) => {
                  const origIdx = qrCodes.findIndex(q => q.qrId === qr.qrId);
                  const qrTransactions = transactions.filter(txn => txn.qrId === qr.qrId);
                  return (
                    <tr key={qr.qrId} style={{
                      background: idx % 2 === 0 ? '#f9fafb' : '#fff',
                      borderBottom: '1.5px solid #e5e7eb',
                      transition: 'background 0.2s',
                      boxShadow: '0 1px 4px rgba(102,126,234,0.04)',
                      cursor: 'pointer',
                    }}
                      onMouseOver={e => (e.currentTarget.style.background = '#eef2ff')}
                      onMouseOut={e => (e.currentTarget.style.background = idx % 2 === 0 ? '#f9fafb' : '#fff')}
                    >
                      <td style={{ padding: '12px', borderRight: '2px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>{qr.status === "Inactive" ? "Inactive" : <div style={{ padding: '8px', background: '#f5f7fa', borderRadius: '10px', display: 'inline-block' }}><QRCode value={JSON.stringify(qr)} size={50} /></div>}</td>
                      <td style={{ borderRight: '2px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle', fontWeight: 600, color: '#4f46e5' }}>{qr.qrId}</td>
                      <td style={{ borderRight: '2px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle', fontWeight: 500 }}>{qr.referenceName}</td>
                      <td style={{ borderRight: '2px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle', fontFamily: 'monospace', color: '#374151' }}>{qr.vpa}</td>
                      <td style={{ borderRight: '2px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle', color: '#6366f1', fontWeight: 500 }}>{qr.category}</td>
                      <td style={{ borderRight: '2px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle', color: '#059669', fontWeight: 600 }}>₹{qr.maxAmount}</td>
                      <td style={{ borderRight: '2px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                        <button onClick={() => handleToggleStatus(origIdx)} style={{
                          background: qr.status === 'Active' ? 'linear-gradient(90deg,#4caf50,#43e97b)' : 'linear-gradient(90deg,#f44336,#f093fb)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 16px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 1px 4px rgba(76,175,80,0.08)'
                        }}>{qr.status}</button>
                      </td>
                      <td style={{ borderRight: '2px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                        <button style={{ marginRight: 6, background: '#6366f1', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 500, cursor: 'pointer' }} onClick={() => {
                          setEditIdx(origIdx);
                          setEditInitialData(qrCodes[origIdx]);
                        }}>Edit</button>
                        <button style={{ marginRight: 6, background: '#00bcd4', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 500, cursor: 'pointer' }} onClick={() => setShowCardIdx(origIdx)}>Download</button>
                        <button style={{ marginRight: 6, background: '#f59e42', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleViewQrTransactions(qr.qrId)}>View ({qrTransactions.length})</button>
                        <button style={{ background: '#f44336', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleDeleteQR(origIdx)}>Delete</button>
                      </td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <button onClick={() => toggleQrSimulation(origIdx)} disabled={qr.status === "Inactive"} style={{
                          background: qr.simulationActive ? 'linear-gradient(90deg,#f093fb,#f5576c)' : 'linear-gradient(90deg,#43e97b,#38f9d7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 16px',
                          fontWeight: 600,
                          cursor: qr.status === 'Inactive' ? 'not-allowed' : 'pointer',
                          opacity: qr.status === 'Inactive' ? 0.5 : 1,
                        }}>
                          {qr.simulationActive ? "Stop" : "Start"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody> */}
              <tbody>
                {filteredQRCodes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        padding: '24px',
                        textAlign: 'center',
                        fontStyle: 'italic',
                        color: '#6b7280',
                        fontWeight: 500,
                      }}
                    >
                      No Records Found
                    </td>
                  </tr>
                ) : (
                  filteredQRCodes.map((qr, idx) => {
                    const origIdx = qrCodes.findIndex(q => q.qrId === qr.qrId);
                    const transactionCount = qrTransactionCounts[qr.qrId] || 0;
                    return (
                      <tr
                        key={qr.qrId}
                        style={{
                          background: idx % 2 === 0 ? '#f9fafb' : '#fff',
                          borderBottom: '1.5px solid #e5e7eb',
                          transition: 'background 0.2s',
                          boxShadow: '0 1px 4px rgba(102,126,234,0.04)',
                          cursor: 'pointer',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = '#eef2ff')}
                        onMouseOut={e =>
                        (e.currentTarget.style.background =
                          idx % 2 === 0 ? '#f9fafb' : '#fff')
                        }
                      >
                        <td
                          style={{
                            padding: '12px',
                            borderRight: '2px solid #e5e7eb',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                          }}
                        >
                          {qr.status === 'Inactive' ? (
                            <span style={{
                              color: '#ef4444',
                              fontWeight: 600,
                              fontSize: '14px',
                              background: '#fef2f2',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid #fecaca'
                            }}>
                              Inactive QR
                            </span>
                          ) : (
                            <div
                              style={{
                                padding: '8px',
                                background: '#f5f7fa',
                                borderRadius: '10px',
                                display: 'inline-block',
                              }}
                            >
                              <QRCode value={JSON.stringify(qr)} size={50} />
                            </div>
                          )}
                        </td>
                        <td
                          style={{
                            borderRight: '2px solid #e5e7eb',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            fontWeight: 600,
                            color: '#4f46e5',
                          }}
                        >
                          {qr.qrId}
                        </td>
                        <td
                          style={{
                            borderRight: '2px solid #e5e7eb',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            fontWeight: 500,
                          }}
                        >
                          {qr.referenceName}
                        </td>
                        <td
                          style={{
                            borderRight: '2px solid #e5e7eb',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            fontFamily: 'monospace',
                            color: '#374151',
                          }}
                        >
                          {qr.vpa}
                        </td>
                        <td
                          style={{
                            borderRight: '2px solid #e5e7eb',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            color: '#6366f1',
                            fontWeight: 500,
                          }}
                        >
                          {qr.category}
                        </td>
                        <td
                          style={{
                            borderRight: '2px solid #e5e7eb',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            color: '#059669',
                            fontWeight: 600,
                          }}
                        >
                          ₹{qr.maxAmount}
                        </td>
                        <td
                          style={{
                            borderRight: '2px solid #e5e7eb',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                          }}
                        >
                          <button
                            onClick={() => handleToggleStatus(origIdx)}
                            disabled={statusToggleLoading === qr.qrId}
                            style={{
                              background: statusToggleLoading === qr.qrId
                                ? 'linear-gradient(90deg,#9ca3af,#6b7280)'
                                : qr.status === 'Active'
                                  ? 'linear-gradient(90deg,#4caf50,#43e97b)'
                                  : 'linear-gradient(90deg,#f44336,#f093fb)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 16px',
                              fontWeight: 600,
                              cursor: statusToggleLoading === qr.qrId ? 'not-allowed' : 'pointer',
                              opacity: statusToggleLoading === qr.qrId ? 0.7 : 1,
                              boxShadow: '0 1px 4px rgba(76,175,80,0.08)',
                            }}
                          >
                            {statusToggleLoading === qr.qrId ? 'Loading...' : qr.status}
                          </button>
                        </td>
                        <td
                          style={{
                            borderRight: '2px solid #e5e7eb',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                          }}
                        >
                          <button
                            style={{
                              marginRight: 6,
                              background: '#6366f1',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              padding: '6px 12px',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              setEditIdx(origIdx);
                              setEditInitialData(qrCodes[origIdx]);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            style={{
                              marginRight: 6,
                              background: '#00bcd4',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              padding: '6px 12px',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                            onClick={() => setShowCardIdx(origIdx)}
                          >
                            Download
                          </button>
                          <button
                            style={{
                              marginRight: 6,
                              background: '#f59e42',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              padding: '6px 12px',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                            onClick={() => handleViewQrTransactions(qr.qrId)}
                          >
                            View ({transactionCount})
                          </button>
                          <button
                            style={{
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              padding: '6px 12px',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                            onClick={() => handleDeleteQRById(origIdx)}
                          >
                            Delete
                          </button>
                        </td>
                        <td
                          style={{
                            textAlign: 'center',
                            verticalAlign: 'middle',
                          }}
                        >
                          <button
                            onClick={() => toggleQrSimulation(origIdx)}
                            disabled={qr.status === 'Inactive' || toggleLoading === qr.qrId}
                            style={{
                              background: toggleLoading === qr.qrId 
                                ? 'linear-gradient(90deg,#9ca3af,#6b7280)'
                                : qr.simulationActive
                                  ? 'linear-gradient(90deg,#f093fb,#f5576c)'
                                  : 'linear-gradient(90deg,#43e97b,#38f9d7)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 16px',
                              fontWeight: 600,
                              cursor: (qr.status === 'Inactive' || toggleLoading === qr.qrId) ? 'not-allowed' : 'pointer',
                              opacity: (qr.status === 'Inactive' || toggleLoading === qr.qrId) ? 0.7 : 1,
                            }}
                          >
                            {toggleLoading === qr.qrId ? 'Loading...' : (qr.simulationActive ? 'Stop' : 'Start')}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QRGenerationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreateQR} />
      <QRGenerationModal isOpen={editIdx !== null} onClose={() => setEditIdx(null)} onSubmit={handleEditQR} initialData={editInitialData} isEdit={true} />
      <Modal isOpen={showCardIdx !== null} onClose={() => setShowCardIdx(null)}>
        {showCardIdx !== null && (
          <QRCodeCard qr={{
            qrId: qrCodes[showCardIdx].qrId,
            vpa: qrCodes[showCardIdx].vpa,
            referenceName: qrCodes[showCardIdx].referenceName,
            maxAmount: qrCodes[showCardIdx].maxAmount || '',
            category: qrCodes[showCardIdx].category,
            status: qrCodes[showCardIdx].status,
          }} />
        )}
      </Modal>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </>
  );
};

export default GeneratedQRPage;
