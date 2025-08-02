import React, { useState, useEffect } from "react";
import { useAppSelector } from '../store/hooks';
import type { QRCode } from '../types/index';
import Modal from "./Modal";

const categories = ["Retail", "Rental", "Education", "Custom"];

function generateQRId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  while (true) {
    id = Array.from({ length: 5 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
    // Must have at least one letter and one number
    if (/[A-Z]/.test(id) && /[0-9]/.test(id)) {
      return id;
    }
  }
}

interface QRGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<QRCode, 'createdAt' | 'simulationActive' | 'status'>) => void;
  initialData?: Partial<QRCode>;
  isEdit?: boolean;
}

const QRGenerationModal: React.FC<QRGenerationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
}) => {
  const [qrId, setQrId] = useState("");
  // Get all QR codes from redux
  const qrCodes = useAppSelector((state) => state.qrCodes.qrCodes) as QRCode[];
  const [referenceName, setReferenceName] = useState("");
  const [description, setDescription] = useState("");
  const [maxAmount, setMaxAmount] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<'Retail' | 'Rental' | 'Education' | 'Custom'>("Retail");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setQrId(initialData.qrId || generateQRId());
        setReferenceName(initialData.referenceName || "");
        setDescription(initialData.description || "");
        setMaxAmount(initialData.maxAmount || undefined);
        setCategory(initialData.category || "Retail");
        setNotes(initialData.notes || "");
        setError("");
      } else {
        setQrId(generateQRId());
        setReferenceName("");
        setDescription("");
        setMaxAmount(undefined);
        setCategory("Retail");
        setNotes("");
        setError("");
      }
    }
  }, [isOpen, initialData]);

  // Generate a QR ID that is not already used
  const handleGenerateId = () => {
    let newId = "";
    let attempts = 0;
    do {
      newId = generateQRId();
      attempts++;
      // Prevent infinite loop
      if (attempts > 100) break;
    } while (qrCodes.some((qr: QRCode) => qr.qrId === newId));
    setQrId(newId);
  } 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Strict validation for QR Identifier format
    if (!qrId || qrId.length !== 5) {
      setError("QR Identifier must be exactly 5 characters long");
      return;
    }
    const qrIdRegex = /^[A-Z0-9]{5}$/;
    if (!qrIdRegex.test(qrId)) {
      setError("QR Identifier must contain only uppercase letters (A-Z) and numbers (0-9)");
      return;
    }
    // Ensure it contains at least one letter and one number
    const hasLetter = /[A-Z]/.test(qrId);
    const hasNumber = /[0-9]/.test(qrId);
    if (!hasLetter || !hasNumber) {
      setError("QR Identifier must contain at least one letter (A-Z) and one number (0-9)");
      return;
    }
    if (!referenceName.trim()) {
      setError("Reference Name is required");
      return;
    }

    // Check for duplicate QR Identifier (exclude current QR in edit mode)
    if (qrCodes.some((qr: QRCode) => qr.qrId === qrId && (!isEdit || qr.qrId !== initialData?.qrId))) {
      setError("This QR Identifier is already used. Please generate a new one.");
      return;
    }

    // Check for same referenceName and category with same QR Identifier
    if (qrCodes.some((qr: QRCode) => qr.referenceName.trim().toLowerCase() === referenceName.trim().toLowerCase() && qr.category === category && qr.qrId === qrId)) {
      setError("Same QR Identifier cannot be used for same Reference Name and Category.");
      return;
    }

    // Check for same referenceName and category with different QR Identifier
    if (qrCodes.some((qr: QRCode) => qr.referenceName.trim().toLowerCase() === referenceName.trim().toLowerCase() && qr.category === category && qr.qrId !== qrId)) {
      // This is allowed, but ensure QR Identifier is unique (already checked above)
    }

    const vpa = `sabpaisa.${qrId}@okhdfcbank`;
    onSubmit({
      qrId,
      vpa,
      referenceName: referenceName.trim(),
      description: description.trim(),
      maxAmount,
      category,
      notes: notes.trim(),
    });
    onClose();
  };

  const vpa = `sabpaisa.${qrId}@okhdfcbank`;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        minWidth: '691px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 8px 32px rgba(102,126,234,0.12)',
        position: 'relative'
      }}>
        {/* Header with close button on right */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '20px',
          position: 'relative'
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h2 style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: '700',
              color: 'linear-gradient(90deg,#667eea,#764ba2)',
              background: 'linear-gradient(90deg,#667eea,#764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.04em',
              marginBottom: '8px',
              textShadow: '0 2px 8px rgba(102,126,234,0.12)'
            }}>
              {isEdit ? "Edit QR Code" : "Generate SabPaisa QR Code"}
            </h2>
            <p style={{
              margin: 0,
              color: '#666',
              fontSize: '17px',
              fontWeight: 500,
              letterSpacing: '0.01em'
            }}>
              {isEdit ? "Update your QR code details" : "Create a new QR code for payments"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'none',
              border: 'none',
              fontSize: '2rem',
              color: '#6366f1',
              cursor: 'pointer',
              zIndex: 10,
              padding: 0,
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* QR ID Field */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '20px',
              alignItems: 'center'
            }}>
              <label style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#495057',
                textAlign: 'right',
                paddingRight: '16px'
              }}>
                QR Identifier: <span style={{ color: '#f44336' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={qrId}
                    onChange={(e) => {
                      // Only allow uppercase letters and numbers, max 5 characters
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
                      setQrId(value);
                      // Clear error when user starts typing
                      if (error && error.includes("QR Identifier")) {
                        setError("");
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: (() => {
                        if (qrId.length === 5 && /^[A-Z0-9]{5}$/.test(qrId)) {
                          const hasLetter = /[A-Z]/.test(qrId);
                          const hasNumber = /[0-9]/.test(qrId);
                          return hasLetter && hasNumber ? '2px solid #4caf50' : '2px solid #ff9800';
                        } else if (qrId.length > 0) {
                          return '2px solid #ff9800';
                        } else {
                          return '2px solid #e9ecef';
                        }
                      })(),
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: 'monospace',
                      fontWeight: '500',
                      color: '#495057',
                      background: '#f8f9fa',
                      transition: 'all 0.3s ease'
                    }}
                    maxLength={5}
                    placeholder="5-char ID (A-Z, 0-9)"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateId}
                    style={{
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Generate
                  </button>
                </div>
                {/* Real-time validation feedback */}
                {qrId.length > 0 && (
                  <div style={{
                    fontSize: '12px',
                    color: (() => {
                      if (qrId.length === 5 && /^[A-Z0-9]{5}$/.test(qrId)) {
                        const hasLetter = /[A-Z]/.test(qrId);
                        const hasNumber = /[0-9]/.test(qrId);
                        return hasLetter && hasNumber ? '#4caf50' : '#ff9800';
                      }
                      return '#ff9800';
                    })(),
                    fontWeight: '500',
                    paddingLeft: '4px'
                  }}>
                    {(() => {
                      if (qrId.length === 5 && /^[A-Z0-9]{5}$/.test(qrId)) {
                        const hasLetter = /[A-Z]/.test(qrId);
                        const hasNumber = /[0-9]/.test(qrId);
                        if (hasLetter && hasNumber) {
                          return '✓ Valid QR Identifier';
                        } else if (!hasLetter) {
                          return '❌ Must contain at least one letter (A-Z)';
                        } else if (!hasNumber) {
                          return '❌ Must contain at least one number (0-9)';
                        }
                      } else if (qrId.length < 5) {
                        return `${5 - qrId.length} character${5 - qrId.length === 1 ? '' : 's'} remaining`;
                      } else {
                        return 'Invalid characters detected';
                      }
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Reference Name Field */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '20px',
              alignItems: 'center'
            }}>
              <label style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#495057',
                textAlign: 'right',
                paddingRight: '16px'
              }}>
                Reference Name: <span style={{ color: '#f44336' }}>*</span>
              </label>
              <input
                type="text"
                value={referenceName}
                onChange={(e) => setReferenceName(e.target.value)}
                placeholder="Enter reference name"
                style={{
                  width: '97%',
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1e88e5'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
            </div>

            {/* Description Field */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '20px',
              alignItems: 'flex-start'
            }}>
              <label style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#495057',
                textAlign: 'right',
                paddingRight: '16px',
                paddingTop: '12px'
              }}>
                Description:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description (optional)"
                rows={3}
                style={{
                  width: '98%',
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'vertical',
                  minHeight: '80px',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1e88e5'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
            </div>

            {/* Max Amount Field */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '20px',
              alignItems: 'center'
            }}>
              <label style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#495057',
                textAlign: 'right',
                paddingRight: '16px'
              }}>
                Max Amount:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={maxAmount ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setMaxAmount(undefined);
                    } else {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue) && numValue > 0) {
                        setMaxAmount(numValue);
                      }
                    }
                  }}
                  placeholder="Enter maximum amount (optional)"
                  min="0"
                  step="0.01"
                  style={{
                    width: '92%',
                    padding: '12px 16px',
                    paddingLeft: '40px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1e88e5'}
                  onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                />
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#495057'
                }}>
                  ₹
                </div>
              </div>
            </div>

            {/* Category Field */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '20px',
              alignItems: 'center'
            }}>
              <label style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#495057',
                textAlign: 'right',
                paddingRight: '16px'
              }}>
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '107%',
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: 'white',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1e88e5'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes Field */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '20px',
              alignItems: 'flex-start'
            }}>
              <label style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#495057',
                textAlign: 'right',
                paddingRight: '16px',
                paddingTop: '12px'
              }}>
                Notes:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter additional notes (optional)"
                rows={3}
                style={{
                  width: '98%',
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'vertical',
                  minHeight: '80px',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1e88e5'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
            </div>

            {/* VPA Preview */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '20px',
              alignItems: 'center'
            }}>
              <label style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#495057',
                textAlign: 'right',
                paddingRight: '16px'
              }}>
                VPA Preview:
              </label>
              <div style={{
                padding: '12px 16px',
                background: '#f8f9fa',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'monospace',
                color: '#495057',
                fontWeight: '500'
              }}>
                {vpa}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginTop: '20px',
              padding: '12px 16px',
              background: '#ffebee',
              border: '1px solid #f44336',
              borderRadius: '8px',
              color: '#c62828',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '2px solid #f0f0f0'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#5a6268'}
              onMouseOut={(e) => e.currentTarget.style.background = '#6c757d'}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
              }}
            >
              {isEdit ? "Save Changes" : "Create QR"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default QRGenerationModal; 