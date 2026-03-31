import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Header({ 
  title = 'PANDUSPEC', 
  showSearch = false, 
  searchQuery = '',
  onSearchChange 
}: HeaderProps) {
  return (
    <header className="tui-header">
      <div className="tui-header-frame">
        <div className="tui-header-inner">
          <div className="tui-header-left">
            <span className="tui-header-title">{title}</span>
            <span className="tui-header-subtitle">Product Specification Database</span>
          </div>
          {showSearch && (
            <div className="tui-header-search">
              <span className="tui-search-prompt">$</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="tui-search-input"
                placeholder="search..."
                autoFocus
              />
              <span className="tui-cursor">_</span>
            </div>
          )}
          <nav className="tui-header-nav">
            <Link href="/">home</Link>
            <span className="tui-nav-sep">/</span>
            <Link href="/#categories">categories</Link>
            <span className="tui-nav-sep">/</span>
            <Link href="/#all">products</Link>
          </nav>
        </div>
      </div>
      <style>{`
        .tui-header {
          padding: 24px 16px 16px 16px;
        }
        .tui-header-frame {
          max-width: 1200px;
          margin: 0 auto;
          border: 1px solid var(--border-color);
          position: relative;
        }
        .tui-header-frame::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 20px;
          right: 20px;
          height: 1px;
          background: var(--bg-primary);
        }
        .tui-header-frame::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 20px;
          right: 20px;
          height: 1px;
          background: var(--bg-primary);
        }
        .tui-header-inner {
          background: var(--bg-secondary);
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin: 4px;
          min-width: 0;
        }
        .tui-header-left {
          display: flex;
          align-items: baseline;
          gap: 12px;
          min-width: 0;
          flex: 1;
        }
        .tui-header-title {
          color: var(--text-primary);
          font-weight: bold;
          font-size: 18px;
          letter-spacing: 1px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .tui-header-subtitle {
          color: var(--text-muted);
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tui-header-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-primary);
          padding: 6px 12px;
          border: 1px solid var(--border-dim);
        }
        .tui-search-prompt {
          color: var(--text-muted);
          font-weight: bold;
        }
        .tui-search-input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 14px;
          outline: none;
          width: 180px;
        }
        .tui-search-input::placeholder {
          color: var(--text-subtle);
        }
        .tui-cursor {
          color: var(--accent-primary);
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        .tui-header-nav {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .tui-header-nav a {
          color: var(--text-secondary);
          font-size: 13px;
          transition: color 0.15s;
          white-space: nowrap;
        }
        .tui-header-nav a:hover {
          color: var(--accent-primary);
          text-decoration: none;
        }
        .tui-nav-sep {
          color: var(--border-dim);
          font-size: 13px;
        }
        @media (max-width: 640px) {
          .tui-header-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .tui-header-left {
            width: 100%;
          }
          .tui-header-nav {
            width: 100%;
            justify-content: flex-start;
          }
          .tui-header-subtitle {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .tui-header-title {
            font-size: 16px;
          }
          .tui-header-nav a {
            font-size: 12px;
          }
        }
      `}</style>
    </header>
  );
}
