import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from '../store/hooks';
import { useSafeQRCodes, useQRCodesStats, useTransactionsStats } from '../store/safeHooks';
import type { QRCode } from '../types/index';
import { 
  fetchQRCodes,
  createNewQRCode,
  updateQRCode
} from '../store/slices/qrCodesSlice';
import { fetchTransactionStats } from '../store/slices/transactionsSlice';
import QRGenerationModal from "./QRGenerationModal";
import QRCodeCard from "./QRCodeCard";
import Modal from "./Modal";
import Header from "./Header";

interface TransactionStats {
  totalTransactions: number;
  totalAmount: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  successfulAmount: number;
  averageAmount: number;
  successRate: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const qrCodes = useSafeQRCodes();
  const qrStats = useQRCodesStats();
  const transactionStats = useTransactionsStats() as TransactionStats;

  const [modalOpen, setModalOpen] = useState(false);
  const [showCardIdx, setShowCardIdx] = useState<number | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editInitialData, setEditInitialData] = useState<Partial<QRCode> | null>(null);

  // Load data on component mount
  useEffect(() => {
    dispatch(fetchQRCodes());
    dispatch(fetchTransactionStats({})); // Fetch only stats for dashboard performance
  }, [dispatch]);

  const handleCreateQR = async (data: Omit<QRCode, 'createdAt' | 'simulationActive' | 'status'>) => {
    try {
      await dispatch(createNewQRCode(data)).unwrap();
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to create QR code:', error);
      // You can add error handling UI here
    }
  };

  const handleEditQR = (data: Omit<QRCode, 'createdAt' | 'simulationActive' | 'status'>) => {
    if (editIdx !== null) {
      dispatch(updateQRCode({ index: editIdx, qrCode: data }));
      setEditIdx(null);
      setEditInitialData(null);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh', width: '100%' }}>
      <Header />
      
      {/* Phase 1: Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '24px',
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        onClick={() => navigate('/generated-qr')}
        >
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total QR Codes</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>{qrStats.total}</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Click to view all QR codes</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '24px',
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        onClick={() => navigate('/transactions')}
        >
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Transactions</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>{transactionStats.totalTransactions}</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Click to view all transactions</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          padding: '24px',
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        onClick={() => navigate('/generated-qr')}
        >
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Active QR Codes</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>{qrStats.active}</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Currently active QR codes</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          padding: '24px',
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(67, 233, 123, 0.3)',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        onClick={() => navigate('/generated-qr')}
        >
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Active Simulations</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>{qrStats.withSimulation}</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Running payment simulations</div>
        </div>
      </div>

      {/* Phase 2: Simulation Status Banner */}
      {qrStats.withSimulation > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
          border: '1px solid #ffb74d',
          borderRadius: '12px',
          padding: '16px 24px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 16px rgba(255, 183, 77, 0.2)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: '#2e7d32', fontWeight: '600', fontSize: '16px' }}>
              🟢 Simulation Active: Generating payments every 5 seconds for {qrStats.withSimulation} active QR{qrStats.withSimulation === 1 ? '' : 's'}
            </span>
            <span style={{ color: '#f57f17', fontWeight: '500', fontSize: '13px' }}>
              ℹ️ Each QR code supports up to 100 simulated transactions. Simulations auto-stop when limit is reached.
            </span>
          </div>
          <button 
            onClick={() => navigate('/generated-qr')}
            style={{
              background: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Manage QR Codes
          </button>
        </div>
      )}

      {/* Phase 3: Quick Actions */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        marginBottom: '32px'
      }}>
        <h2 style={{ margin: '0 0 24px 0', color: '#333', fontSize: '24px', fontWeight: '600' }}>Quick Actions</h2>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          <button 
            onClick={() => setModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>+</span>
            Create New QR Code
          </button>
          
          <button 
            onClick={() => navigate('/generated-qr')}
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
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
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>📋</span>
            Manage QR Codes
          </button>
          
          <button 
            onClick={() => navigate('/transactions')}
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>📊</span>
            View Transactions
          </button>
        </div>
      </div>

      {/* Phase 4: Recent Activity */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ margin: '0 0 24px 0', color: '#333', fontSize: '24px', fontWeight: '600' }}>Recent Activity</h2>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
          <div>
            <h3 style={{ margin: '0 0 16px 0', color: '#666', fontSize: '18px', fontWeight: '600' }}>Latest QR Codes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {qrCodes.length > 0 ? (
                qrCodes.slice(0, 3).map((qr) => (
                  <div key={qr.qrId} style={{
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    background: '#fafafa'
                  }}>
                    <div style={{ fontWeight: '600', color: '#333' }}>{qr.referenceName}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>ID: {qr.qrId} • {qr.category}</div>
                  </div>
                ))
              ) : (
                <div style={{
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  background: '#fafafa',
                  textAlign: 'center',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  No QR codes yet
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 style={{ margin: '0 0 16px 0', color: '#666', fontSize: '18px', fontWeight: '600' }}>Transaction Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                background: '#fafafa'
              }}>
                <div style={{ fontWeight: '600', color: '#333' }}>Total: {transactionStats.totalTransactions}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Success: {transactionStats.successfulTransactions} • Failed: {transactionStats.failedTransactions}</div>
              </div>
              <div style={{
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                background: '#fafafa'
              }}>
                <div style={{ fontWeight: '600', color: '#333' }}>₹{transactionStats.totalAmount?.toLocaleString('en-IN') || '0'}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Total Amount • Success Rate: {transactionStats.successRate}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 5: Create QR Modal */}
      {modalOpen && (
        <QRGenerationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateQR}
        />
      )}
      <QRGenerationModal
        isOpen={editIdx !== null}
        onClose={() => { setEditIdx(null); setEditInitialData(null); }}
        onSubmit={handleEditQR}
        initialData={editInitialData || undefined}
        isEdit={true}
      />

      {/* Phase 6: Show QR Modal */}
      {showCardIdx !== null && Array.isArray(qrCodes) && qrCodes[showCardIdx] && (
        <Modal isOpen={showCardIdx !== null} onClose={() => setShowCardIdx(null)}>
          <QRCodeCard qr={{
            qrId: qrCodes[showCardIdx].qrId,
            vpa: qrCodes[showCardIdx].vpa,
            referenceName: qrCodes[showCardIdx].referenceName,
            maxAmount: qrCodes[showCardIdx].maxAmount?.toString() || '',
            category: qrCodes[showCardIdx].category,
            status: qrCodes[showCardIdx].status,
          }} />
        </Modal>
      )}

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard; 