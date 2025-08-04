import React from 'react';

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const Paginator: React.FC<PaginatorProps> = ({
  currentPage,
  totalPages,
  totalRecords: totalRecordsProp,
  pageSize,
  onPageChange,
  hasNext,
  hasPrev,
}) => {
  const totalRecords = totalRecordsProp || 0;
  // Handle NaN values with fallbacks
  const safeCurrentPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  const safeTotalPages = isNaN(totalPages) || totalPages < 1 ? 1 : totalPages;
  const safePageSize = isNaN(pageSize) || pageSize < 1 ? 20 : pageSize;
  const safeTotalRecords = isNaN(totalRecords) || totalRecords < 0 ? 0 : totalRecords;
  
  const startRecord = ((safeCurrentPage - 1) * safePageSize) + 1;
  const endRecord = Math.min(safeCurrentPage * safePageSize, safeTotalRecords);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (safeTotalPages <= maxVisible) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, safeCurrentPage - 2);
      const end = Math.min(safeTotalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageStyle = {
    padding: '8px 12px',
    margin: '0 4px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: '#333',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  };

  const activePageStyle = {
    ...pageStyle,
    backgroundColor: '#667eea',
    color: 'white',
    borderColor: '#667eea',
  };

  const disabledPageStyle = {
    ...pageStyle,
    cursor: 'not-allowed',
    opacity: 0.5,
    backgroundColor: '#f5f5f5',
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '24px',
      background: 'white',
      borderTop: '1px solid #e0e0e0'
    }}>
      {/* Records info */}
      <div style={{
        fontSize: '14px',
        color: '#666',
        fontWeight: '500'
      }}>
        Showing {startRecord}-{endRecord} of {safeTotalRecords} transactions
      </div>

      {/* Pagination controls */}
      {safeTotalRecords > safePageSize && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {/* Previous button */}
          <button
            onClick={() => onPageChange(safeCurrentPage - 1)}
            disabled={!hasPrev}
            style={hasPrev ? pageStyle : disabledPageStyle}
            onMouseOver={(e) => {
              if (hasPrev) {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={(e) => {
              if (hasPrev) {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            ← Previous
          </button>

          {/* First page indicator */}
          {safeCurrentPage > 3 && safeTotalPages > 5 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                style={pageStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                1
              </button>
              <span style={{ padding: '8px 4px', color: '#666' }}>...</span>
            </>
          )}

          {/* Page numbers */}
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              style={pageNum === safeCurrentPage ? activePageStyle : pageStyle}
              onMouseOver={(e) => {
                if (pageNum !== safeCurrentPage) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseOut={(e) => {
                if (pageNum !== safeCurrentPage) {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {pageNum}
            </button>
          ))}

          {/* Last page indicator */}
          {safeCurrentPage < safeTotalPages - 2 && safeTotalPages > 5 && (
            <>
              <span style={{ padding: '8px 4px', color: '#666' }}>...</span>
              <button
                onClick={() => onPageChange(safeTotalPages)}
                style={pageStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {safeTotalPages}
              </button>
            </>
          )}

          {/* Next button */}
          <button
            onClick={() => onPageChange(safeCurrentPage + 1)}
            disabled={!hasNext}
            style={hasNext ? pageStyle : disabledPageStyle}
            onMouseOver={(e) => {
              if (hasNext) {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={(e) => {
              if (hasNext) {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Paginator;
