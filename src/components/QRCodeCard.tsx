import React, { useRef } from "react";
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

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
        });
        const link = document.createElement("a");
        link.download = `qr-${qr.qrId}.png`;
        link.href = canvas.toDataURL();
        link.click();
        if (onDownload) onDownload();
      } catch (error) {
        console.error("Error downloading QR card:", error);
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
      <div style={{ margin: "0 auto 16px", background: "#fff", padding: 8, display: "inline-block" }}>
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
      </div>
      <div style={{ textAlign: "left", marginTop: 12 }}>
        <div><strong>Reference Name:</strong> {qr.referenceName}</div>
        <div><strong>VPA:</strong> {qr.vpa}</div>
        <div><strong>Max Amount:</strong> {qr.maxAmount || "-"}</div>
        <div><strong>Category:</strong> {qr.category}</div>
        <div><strong>QR Identifier:</strong> {qr.qrId}</div>
      </div>
      <button onClick={handleDownload} style={{ marginTop: 16, padding: "8px 16px", background: "#1e88e5", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
        Download QR Card
      </button>
    </div>
  );
};

export default QRCodeCard; 