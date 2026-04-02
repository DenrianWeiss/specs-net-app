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
            <span className="tui-nav-sep">/</span>
            <Link href="/coremark">coremark</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
