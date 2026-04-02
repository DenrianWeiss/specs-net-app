'use client';

import { useEffect, useRef } from 'react';

interface SortableTableProps {
  children: React.ReactNode;
  className?: string;
}

export function SortableTable({ children, className = '' }: SortableTableProps) {
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tableRef.current) return;

    const table = tableRef.current.querySelector('table');
    if (!table) return;

    const headers = table.querySelectorAll('thead th');
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    // Add sort indicators and click handlers
    headers.forEach((th, index) => {
      const header = th as HTMLElement;
      header.style.cursor = 'pointer';
      header.style.userSelect = 'none';
      header.style.position = 'relative';
      header.style.paddingRight = '20px';

      // Add sort indicator
      const indicator = document.createElement('span');
      indicator.className = 'sort-indicator';
      indicator.innerHTML = ' ⇅';
      indicator.style.color = 'var(--text-muted)';
      indicator.style.fontSize = '12px';
      indicator.style.position = 'absolute';
      indicator.style.right = '6px';
      indicator.style.top = '50%';
      indicator.style.transform = 'translateY(-50%)';
      header.appendChild(indicator);

      header.addEventListener('click', () => {
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isAsc = header.dataset.sort !== 'asc';

        // Reset all headers
        headers.forEach(h => {
          h.removeAttribute('data-sort');
          const ind = h.querySelector('.sort-indicator');
          if (ind) ind.innerHTML = ' ⇅';
        });

        // Set current sort
        header.dataset.sort = isAsc ? 'asc' : 'desc';
        indicator.innerHTML = isAsc ? ' ▲' : ' ▼';

        // Sort rows
        rows.sort((a, b) => {
          const aVal = a.children[index]?.textContent?.trim() || '';
          const bVal = b.children[index]?.textContent?.trim() || '';

          // Try to parse as numbers
          const aNum = parseFloat(aVal);
          const bNum = parseFloat(bVal);

          if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAsc ? aNum - bNum : bNum - aNum;
          }

          // String comparison
          return isAsc
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        });

        // Re-append rows in sorted order
        rows.forEach(row => tbody.appendChild(row));
      });
    });

    // Cleanup
    return () => {
      headers.forEach(th => {
        const header = th as HTMLElement;
        const indicator = header.querySelector('.sort-indicator');
        if (indicator) header.removeChild(indicator);
      });
    };
  }, []);

  return (
    <div ref={tableRef} className={`sortable-table-container ${className}`}>
      {children}
    </div>
  );
}
