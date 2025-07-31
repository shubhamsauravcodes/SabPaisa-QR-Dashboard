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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <input placeholder="Filter by QR ID" value={filterId} onChange={e => setFilterId(e.target.value)} />
              <input placeholder="Filter by Name" value={filterName} onChange={e => setFilterName(e.target.value)} />
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div style={{ marginTop: '12px' }}>
              Showing {filteredQRCodes.length} of {qrCodes.length} QR codes
            </div>
          </div>

          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '16px' }}>QR Code</th>
                  <th>QR ID</th>
                  <th>Name</th>
                  <th>VPA</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {filteredQRCodes.map((qr, idx) => {
                  const origIdx = qrCodes.findIndex(q => q.qrId === qr.qrId);
                  const qrTransactions = transactions.filter(txn => txn.qrId === qr.qrId);
                  return (
                    <tr key={qr.qrId}>
                      <td>{qr.status === "Inactive" ? "Inactive" : <QRCode value={JSON.stringify(qr)} size={50} />}</td>
                      <td>{qr.qrId}</td>
                      <td>{qr.referenceName}</td>
                      <td>{qr.vpa}</td>
                      <td>{qr.category}</td>
                      <td>₹{qr.maxAmount}</td>
                      <td>
                        <button onClick={() => handleToggleStatus(origIdx)}>{qr.status}</button>
                      </td>
                      <td>
                        <button onClick={() => {
                          setEditIdx(origIdx);
                          setEditInitialData(qrCodes[origIdx]);
                        }}>Edit</button>
                        <button onClick={() => setShowCardIdx(origIdx)}>Download</button>
                        <button onClick={() => handleViewQrTransactions(qr.qrId)}>View ({qrTransactions.length})</button>
                        <button onClick={() => handleDeleteQR(origIdx)}>Delete</button>
                      </td>
                      <td>
                        <button onClick={() => toggleQrSimulation(origIdx)} disabled={qr.status === "Inactive"}>
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
