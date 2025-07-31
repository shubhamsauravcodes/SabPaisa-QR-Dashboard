import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addQRCode, updateQRCode, deleteQRCode, toggleQRStatus, toggleSimulation } from '../store/slices/qrCodesSlice';
import QRCode from 'react-qr-code';
import QRGenerationModal from '../components/QRGenerationModal';
import Modal from '../components/Modal';
import QRCodeCard from '../components/QRCodeCard';
import Header from '../components/Header';
import type { QRCode as QRCodeType, Transaction } from '../types';

const GeneratedQRPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const qrCodes = useAppSelector((state) => state.qrCodes.qrCodes) as QRCodeType[];
  const transactions = useAppSelector((state) => state.transactions.transactions) as Transaction[];

  const [filterId, setFilterId] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editInitialData, setEditInitialData] = useState<any>({});
  const [showCardIdx, setShowCardIdx] = useState<number | null>(null);



  const categories = [
    'Retail', 'Rental', 'Education', 'Custom'
  ];

  const filteredQRCodes = useMemo(() => {
    return qrCodes.filter(qr => {
      const matchesId = filterId ? qr.qrId.toLowerCase().includes(filterId.toLowerCase()) : true;
      const matchesName = filterName ? qr.referenceName.toLowerCase().includes(filterName.toLowerCase()) : true;
      const matchesCategory = filterCategory ? qr.category === filterCategory : true;
      const matchesStatus = filterStatus ? qr.status === filterStatus : true;
      return matchesId && matchesName && matchesCategory && matchesStatus;
    });
  }, [qrCodes, filterId, filterName, filterCategory, filterStatus]);

  const handleCreateQR = (data: any) => {
    // Use QR ID and VPA as provided by the modal (already validated and formatted)
    dispatch(addQRCode({
      qrId: data.qrId,
      vpa: data.vpa,
      referenceName: data.referenceName,
      description: data.description || '',
      maxAmount: data.maxAmount || '',
      category: data.category || 'Other',
      notes: data.notes || '',
      status: 'Active',
      simulationActive: false,
      createdAt: new Date()
    }));
    setModalOpen(false);
  };

  const handleEditQR = (data: any) => {
    if (editIdx !== null) {
      dispatch(updateQRCode({
        index: editIdx,
        qrCode: {
          ...qrCodes[editIdx],
          referenceName: data.referenceName,
          description: data.description || '',
          maxAmount: data.maxAmount || '1000',
          category: data.category || 'Other',
          notes: data.notes || ''
        }
      }));
      setEditIdx(null);
    }
  };

  const handleDeleteQR = (idx: number) => {
    if (window.confirm('Are you sure you want to delete this QR code?')) {
      dispatch(deleteQRCode(idx));
    }
  };

  const handleToggleStatus = (idx: number) => {
    dispatch(toggleQRStatus(idx));
    if (qrCodes[idx].status === "Active" && qrCodes[idx].simulationActive) {
      dispatch(toggleSimulation(idx));
    }
  };

  const toggleQrSimulation = (idx: number) => {
    dispatch(toggleSimulation(idx));
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
              <tbody>
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
