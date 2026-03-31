import { Metadata } from 'next';
import { Header, Box, SearchableProductList } from '@/components';
import { getAllProducts, getCategories, getProductIndex } from '@/lib/products';

export const metadata: Metadata = {
  title: 'PanduSpec - Product Specification Database',
};

export default function HomePage() {
  const products = getAllProducts();
  const categories = getCategories();
  const productIndex = getProductIndex();

  return (
    <main className="tui-main">
      <Header title="PANDUSPEC" showSearch={false} />

      <div className="tui-container">
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
