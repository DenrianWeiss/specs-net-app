import React from 'react';

interface BoxProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export function Box({ title, children, className = '', style, id }: BoxProps) {
  return (
    <div id={id} className={`tui-box ${className}`} style={style}>
      {title && (
        <div className="tui-box-header">
          <span className="tui-box-title">{title}</span>
        </div>
      )}
      <div className="tui-box-content">
        {children}
      </div>
      <style>{`
        .tui-box {
          margin: 16px 0;
          border: 1px solid var(--border-color);
          position: relative;
          min-width: 0;
        }
        .tui-box::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 16px;
          right: 16px;
          height: 1px;
          background: var(--bg-primary);
        }
        .tui-box-header {
          position: absolute;
          top: -10px;
          left: 24px;
          background: var(--bg-primary);
          padding: 0 8px;
          max-width: calc(100% - 48px);
        }
        .tui-box-title {
          color: var(--text-primary);
          font-weight: bold;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
          max-width: 100%;
        }
        .tui-box-content {
          padding: 20px 16px 16px 16px;
          background: var(--bg-secondary);
          margin: 4px;
          min-height: 20px;
          min-width: 0;
        }
        @media (max-width: 480px) {
          .tui-box-header {
            left: 16px;
            max-width: calc(100% - 32px);
          }
          .tui-box-title {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
