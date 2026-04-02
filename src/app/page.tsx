import { Metadata } from 'next';
import { Header, Box, SearchableProductList } from '@/components';
import { getAllProducts, getCategories, getProductIndex, getHomePageContent } from '@/lib/products';
import { parseMarkdown } from '@/lib/markdown';

export const metadata: Metadata = {
  title: 'PanduSpec - Product Specification Database',
};

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
      </footer>
    </main>
  );
}
