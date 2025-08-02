import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import sabpaisaLogo from "../assets/sabpaisa-logo.png";

interface QRCodeCardProps {
  qr: {
    qrId: string;
    vpa: string;
    referenceName: string;
    maxAmount: string;
    category: string;
    status?: string;
  };
  onDownload?: () => void;
}

const upiIcons = [
  <span key="gpay" style={{ fontWeight: "bold", color: "#4285F4" }}>GPay</span>,
  <span key="phonepe" style={{ fontWeight: "bold", color: "#673AB7" }}>PhonePe</span>,
  <span key="paytm" style={{ fontWeight: "bold", color: "#0033A0" }}>Paytm</span>,
];

const QRCodeCard: React.FC<QRCodeCardProps> = ({ qr, onDownload }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleDownloadPNG = async () => {
    if (qrCodeRef.current) {
      try {
        const canvas = await html2canvas(qrCodeRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
        });
        const link = document.createElement("a");
        link.download = `qr-${qr.qrId}.png`;
        link.href = canvas.toDataURL();
        link.click();
        if (onDownload) onDownload();
      } catch (error) {
        console.error("Error downloading QR PNG:", error);
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (qrCodeRef.current) {
      try {
        const canvas = await html2canvas(qrCodeRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        // Center the QR code
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = 80;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
        pdf.save(`qr-${qr.qrId}.pdf`);
        if (onDownload) onDownload();
      } catch (error) {
        console.error("Error downloading QR PDF:", error);
      }
    }
  };

  if (qr.status === "Inactive") {
    return (
      <div ref={cardRef} style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 24,
        width: 340,
        background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        textAlign: "center",
        color: "#f44336",
        fontWeight: "bold",
        fontSize: 24,
      }}>
        Invalid QR
      </div>
    );
  }

  return (
    <div ref={cardRef} style={{
      border: "1px solid #ddd",
      borderRadius: 12,
      padding: 24,
      width: 340,
      background: "#fff",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      textAlign: "center",
    }}>
      <div style={{ marginBottom: 12, background: '#222', padding: '8px 0', borderRadius: 8, display: 'flex', justifyContent: 'center' }}>
        <img src={sabpaisaLogo} alt="SabPaisa Logo" style={{ height: 40, width: 'auto', maxWidth: '80%', display: 'block' }} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 16 }}>
        {upiIcons}
      </div>
      <div ref={qrCodeRef} style={{ position: 'relative', margin: "0 auto 16px", background: "#fff", padding: 8, display: "inline-block", width: 144, height: 144 }}>
        <QRCode
          value={JSON.stringify({
            QR_Identifier: qr.qrId,
            VPA: qr.vpa,
            Reference_Name: qr.referenceName,
            Max_Amount: qr.maxAmount,
            Category: qr.category,
          })}
          size={128}
        />
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(44,62,80,0.65)', // dark blue overlay
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            zIndex: 2,
          }}
        >
          <img
            src={sabpaisaLogo}
            alt="SabPaisa Logo"
            style={{
              width: 28,
              height: 28,
              borderRadius: '6px',
              objectFit: 'contain',
              pointerEvents: 'none',
              background: 'transparent',
            }}
          />
        </span>
      </div>
      <div style={{ textAlign: "left", marginTop: 12 }}>
        <div><strong>Reference Name:</strong> {qr.referenceName}</div>
        <div><strong>VPA:</strong> {qr.vpa}</div>
        <div><strong>Max Amount:</strong> {qr.maxAmount || "-"}</div>
        <div><strong>Category:</strong> {qr.category}</div>
        <div><strong>QR Identifier:</strong> {qr.qrId}</div>
      </div>
      <button onClick={() => setShowDownloadModal(true)} style={{ marginTop: 16, padding: "8px 16px", background: "#1e88e5", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
        Download QR Code
      </button>

      {/* Download Modal */}
      {showDownloadModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 12,
            padding: 32,
            boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
            minWidth: 320,
            textAlign: "center",
          }}>
            <div style={{ marginBottom: 24 }}>
              <div ref={qrCodeRef} style={{ position: 'relative', background: "#fff", padding: 8, display: "inline-block", width: 144, height: 144 }}>
                <QRCode
                  value={JSON.stringify({
                    QR_Identifier: qr.qrId,
                    VPA: qr.vpa,
                    Reference_Name: qr.referenceName,
                    Max_Amount: qr.maxAmount,
                    Category: qr.category,
                  })}
                  size={128}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'rgba(44,62,80,0.65)', // dark blue overlay
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                    zIndex: 2,
                  }}
                >
                  <img
                    src={sabpaisaLogo}
                    alt="SabPaisa Logo"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '6px',
                      objectFit: 'contain',
                      pointerEvents: 'none',
                      background: 'transparent',
                    }}
                  />
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <button onClick={handleDownloadPNG} style={{ padding: "10px 24px", background: "#1e88e5", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 }}>
                Download as PNG
              </button>
              <button onClick={handleDownloadPDF} style={{ padding: "10px 24px", background: "#43a047", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 }}>
                Download as PDF
              </button>
              <button onClick={() => setShowDownloadModal(false)} style={{ padding: "10px 24px", background: "#e53935", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeCard; 