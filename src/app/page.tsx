import { Metadata } from 'next';
import { Header, Box, SearchableProductList } from '@/components';
import { getAllProducts, getCategories, getProductIndex, getHomePageContent } from '@/lib/products';

export const metadata: Metadata = {
  title: 'PanduSpec - Product Specification Database',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseMarkdown(content: string): string {
  let html = escapeHtml(content);
  
  // Headers
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
  // Formatting
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  
  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[^]*?<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Tables (basic support)
  const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (match, header, rows) => {
    const headers = header.split('|').map((h: string) => h.trim()).filter(Boolean);
    const headerHtml = headers.map((h: string) => `<th>${h}</th>`).join('');
    const rowLines = rows.trim().split('\n');
    const rowsHtml = rowLines.map((line: string) => {
      const cells = line.split('|').map((c: string) => c.trim()).filter(Boolean);
      return '<tr>' + cells.map((c: string) => `<td>${c}</td>`).join('') + '</tr>';
    }).join('');
    return `<table class="tui-table"><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
  });
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><\/p>/g, '');
  
  // Clean up block elements
  html = html.replace(/<p>(<[h|u|t])/g, '$1');
  html = html.replace(/(<\/[h|u|t][^>]*>)<\/p>/g, '$1');
  
  return html;
}

export default function HomePage() {
  const products = getAllProducts();
  const categories = getCategories();
  const productIndex = getProductIndex();
  const homeContent = getHomePageContent();

  return (
    <main className="tui-main">
      <Header title="PANDUSPEC" showSearch={false} />

      <div className="tui-container">
        {homeContent && (
          <Box title="ABOUT">
            <div 
              className="tui-home-content"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(homeContent.content) }}
            />
            <style>{`
              .tui-home-content {
                line-height: 1.6;
              }
              .tui-home-content h1 {
                font-size: 1.5em;
                margin: 0 0 16px 0;
                color: var(--text-primary);
              }
              .tui-home-content h2 {
                font-size: 1.2em;
                margin: 24px 0 12px 0;
                color: var(--text-primary);
                border-bottom: 1px solid var(--border-dim);
                padding-bottom: 4px;
              }
              .tui-home-content h3 {
                font-size: 1em;
                margin: 16px 0 8px 0;
                color: var(--text-secondary);
              }
              .tui-home-content p {
                margin: 0 0 12px 0;
                color: var(--text-secondary);
              }
              .tui-home-content ul {
                margin: 8px 0;
                padding-left: 20px;
              }
              .tui-home-content li {
                margin: 4px 0;
                color: var(--text-secondary);
              }
              .tui-home-content code {
                background: var(--bg-tertiary);
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 0.9em;
              }
              .tui-home-content strong {
                color: var(--text-primary);
              }
              .tui-home-content table {
                width: 100%;
                border-collapse: collapse;
                margin: 16px 0;
                font-size: 0.9em;
              }
              .tui-home-content th,
              .tui-home-content td {
                border: 1px solid var(--border-dim);
                padding: 8px 12px;
                text-align: left;
              }
              .tui-home-content th {
                background: var(--bg-tertiary);
                color: var(--text-primary);
                font-weight: bold;
              }
              .tui-home-content td {
                color: var(--text-secondary);
              }
            `}</style>
          </Box>
        )}

        <Box title="SYSTEM">
          <div className="tui-stats">
            <div className="tui-stat-item">
              <span className="tui-stat-label">products:</span>
              <span className="tui-stat-value">{products.length}</span>
            </div>
            <div className="tui-stat-item">
              <span className="tui-stat-label">categories:</span>
              <span className="tui-stat-value">{categories.length}</span>
            </div>
          </div>
          <style>{`
            .tui-stats {
              display: flex;
              gap: 32px;
            }
            .tui-stat-item {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .tui-stat-label {
              color: var(--text-muted);
            }
            .tui-stat-value {
              color: var(--text-primary);
              font-weight: bold;
            }
          `}</style>
        </Box>

        <SearchableProductList 
          products={products}
          categories={categories}
          productIndex={productIndex}
        />
      </div>

      <footer className="tui-footer">
        <div className="tui-footer-inner">
          <span className="tui-footer-text">PanduSpec v1.0.0</span>
        </div>
        <style>{`
          .tui-main {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .tui-container {
            flex: 1;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 16px;
            width: 100%;
          }
          .tui-footer {
            margin-top: auto;
            padding: 32px 16px 24px 16px;
          }
          .tui-footer-inner {
            max-width: 1200px;
            margin: 0 auto;
            border-top: 1px solid var(--border-dim);
            padding: 16px 0;
            display: flex;
            justify-content: center;
          }
          .tui-footer-text {
            color: var(--text-muted);
            font-size: 12px;
          }
        `}</style>
      </footer>
    </main>
  );
}
