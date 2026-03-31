import React from 'react';

interface SpecTableProps {
  specs: Record<string, string | number | boolean | string[]>;
  title?: string;
}

function formatValue(value: string | number | boolean | string[]): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return String(value);
}

function getValueType(value: string | number | boolean | string[]): string {
  if (typeof value === 'boolean') return 'bool';
  if (typeof value === 'number') return 'num';
  if (Array.isArray(value)) return 'list';
  return 'str';
}

export function SpecTable({ specs, title = 'SPECIFICATIONS' }: SpecTableProps) {
  const entries = Object.entries(specs);
  
  return (
    <div className="tui-spec-table">
      <div className="tui-spec-table-header">
        <span className="tui-spec-title">{title}</span>
      </div>
      <table className="tui-spec-table-inner">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key} className="tui-spec-row">
              <td className="tui-spec-type">{getValueType(value)}</td>
              <td className="tui-spec-key">{key}</td>
              <td className="tui-spec-eq">=</td>
              <td className="tui-spec-value">{formatValue(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="tui-spec-count">{entries.length} properties</div>
      <style>{`
        .tui-spec-table {
          margin: 16px 0;
          border: 1px solid var(--border-color);
          position: relative;
          min-width: 0;
        }
        .tui-spec-table::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 16px;
          right: 16px;
          height: 1px;
          background: var(--bg-primary);
        }
        .tui-spec-table-header {
          position: absolute;
          top: -10px;
          left: 24px;
          background: var(--bg-primary);
          padding: 0 8px;
          max-width: calc(100% - 48px);
        }
        .tui-spec-title {
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
        .tui-spec-table-inner {
          width: calc(100% - 8px);
          margin: 4px;
          background: var(--bg-secondary);
          border-collapse: collapse;
        }
        .tui-spec-row {
          border-bottom: 1px solid var(--border-dim);
        }
        .tui-spec-row:last-child {
          border-bottom: none;
        }
        .tui-spec-type {
          color: var(--text-subtle);
          font-size: 10px;
          padding: 10px 14px;
          width: 40px;
          font-family: inherit;
        }
        .tui-spec-key {
          color: var(--text-secondary);
          padding: 10px 14px;
          min-width: 150px;
          white-space: nowrap;
        }
        .tui-spec-eq {
          color: var(--text-subtle);
          padding: 0 8px;
        }
        .tui-spec-value {
          color: var(--text-primary);
          padding: 10px 14px;
          word-break: break-word;
          width: 100%;
        }
        .tui-spec-count {
          text-align: right;
          color: var(--text-muted);
          font-size: 11px;
          margin-top: 4px;
          padding: 0 12px 8px 0;
        }
        @media (max-width: 480px) {
          .tui-spec-table-header {
            left: 16px;
            max-width: calc(100% - 32px);
          }
          .tui-spec-title {
            font-size: 12px;
          }
          .tui-spec-key {
            min-width: 100px;
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      `}</style>
    </div>
  );
}
