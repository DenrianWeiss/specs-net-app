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
    </div>
  );
}
