import React from 'react';
import { useNavigate } from 'react-router-dom';
import sabpaisaLogo from "../assets/sabpaisa-logo.png";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "SabPaisa QR Dashboard", 
  subtitle = "Manage QR codes and track payments",
  showBackButton = false 
}) => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '32px',
      padding: '20px 0',
      borderBottom: '2px solid #e0e0e0',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {showBackButton && (
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            marginRight: '16px',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          ← Back
        </button>
      )}
      
      <img 
        src={sabpaisaLogo} 
        alt="SabPaisa Logo" 
        style={{ 
          height: '50px', 
          width: 'auto',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }} 
      />
      <div>
        <h1 style={{
          margin: '0',
          fontSize: '32px',
          fontWeight: '700',
          color: '#333',
          letterSpacing: '-0.5px'
        }}>
          {title}
        </h1>
        <p style={{
          margin: '4px 0 0 0',
          fontSize: '16px',
          color: '#666',
          fontWeight: '400'
        }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default Header; 