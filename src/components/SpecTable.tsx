import React from 'react';

interface SpecTableProps {
  specs: Record<string, unknown>;
  title?: string;
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value)
      .map(([k, v]) => `${k}: ${formatValue(v)}`)
      .join('; ');
  }
  return String(value);
}

function getValueType(value: unknown): string {
  if (typeof value === 'boolean') return 'bool';
  if (typeof value === 'number') return 'num';
  if (Array.isArray(value)) return 'list';
  if (typeof value === 'object' && value !== null) return 'obj';
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
    </div>
  );
}
