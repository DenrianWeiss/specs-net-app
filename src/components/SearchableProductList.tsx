'use client';

import { useState, useMemo, useCallback } from 'react';
import { ProductCard, Box } from '@/components';
import { Product, ProductIndex } from '@/lib/types';

interface SearchableProductListProps {
  products: Product[];
  categories: string[];
  productIndex: ProductIndex[];
}

type ViewState = 'empty' | 'all' | 'category' | 'search';

export function SearchableProductList({ products, categories, productIndex }: SearchableProductListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>('empty');

  // Get products grouped by category
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    categories.forEach(category => {
      grouped[category] = products.filter(p => p.category === category);
    });
    return grouped;
  }, [products, categories]);

  const uncategorizedProducts = useMemo(() => 
    products.filter(p => !p.category),
  [products]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setActiveCategory(null);
    
    if (!query.trim()) {
      setView('empty');
      return;
    }
    
    setView('search');
  }, []);

  // Handle category click
  const handleCategoryClick = useCallback((category: string) => {
    setActiveCategory(category);
    setSearchQuery('');
    setView('category');
  }, []);

  // Get filtered products for search
  const searchResults = useMemo(() => {
    if (view !== 'search' || !searchQuery.trim()) return [];
    
    const q = searchQuery.toLowerCase();
    return productIndex.filter(p => 
      p.searchContent.includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  }, [view, searchQuery, productIndex]);

  // Get products for active category
  const categoryProducts = useMemo(() => {
    if (view !== 'category' || !activeCategory) return [];
    return productsByCategory[activeCategory] || [];
  }, [view, activeCategory, productsByCategory]);

  return (
    <>
      <Box title="SEARCH">
        <div className="tui-search-container">
          <span className="tui-search-prompt">$</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="tui-search-input-main"
            placeholder="type to filter products..."
            autoComplete="off"
          />
          <span className="tui-cursor">_</span>
          <div className="tui-search-count">
            {view === 'search' && `${searchResults.length} results`}
            {view === 'category' && `${categoryProducts.length} items`}
          </div>
        </div>
        <style>{`
          .tui-search-container {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
          }
          .tui-search-prompt {
            color: var(--text-muted);
            font-weight: bold;
          }
          .tui-search-input-main {
            background: var(--bg-primary);
            border: 1px solid var(--border-dim);
            color: var(--text-primary);
            font-family: inherit;
            font-size: 14px;
            padding: 8px 12px;
            flex: 1;
            min-width: 200px;
            outline: none;
            transition: border-color 0.15s;
          }
          .tui-search-input-main:focus {
            border-color: var(--border-color);
          }
          .tui-search-input-main::placeholder {
            color: var(--text-subtle);
          }
          .tui-cursor {
            color: var(--accent-primary);
            animation: blink 1s step-end infinite;
          }
          @keyframes blink {
            50% { opacity: 0; }
          }
          .tui-search-count {
            color: var(--text-muted);
            font-size: 12px;
            margin-left: auto;
          }
        `}</style>
      </Box>

      {categories.length > 0 && (
        <Box title="CATEGORIES">
          <div className="tui-categories">
            {categories.map(category => {
              const count = productsByCategory[category]?.length || 0;
              const isActive = activeCategory === category && view === 'category';
              return (
                <button
                  key={category}
                  className={`tui-category-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <span className="tui-category-name">{category}</span>
                  <span className="tui-category-count">{count}</span>
                </button>
              );
            })}
          </div>
          <style>{`
            .tui-categories {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
            .tui-category-link {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 6px 12px;
              background: var(--bg-tertiary);
              border: 1px solid var(--border-dim);
              color: var(--text-secondary);
              transition: all 0.15s;
              cursor: pointer;
              font-family: inherit;
              font-size: inherit;
            }
            .tui-category-link:hover {
              border-color: var(--border-color);
              background: var(--bg-hover);
              text-decoration: none;
              color: var(--text-primary);
            }
            .tui-category-link.active {
              border-color: var(--border-color);
              background: var(--bg-primary);
              color: var(--text-primary);
            }
            .tui-category-name {
              font-weight: 500;
            }
            .tui-category-count {
              color: var(--text-muted);
              font-size: 12px;
              background: var(--bg-secondary);
              padding: 2px 6px;
              border-radius: 3px;
            }
          `}</style>
        </Box>
      )}

      {view === 'empty' && (
        <div className="tui-empty-state">
          <Box title="WELCOME">
            <div className="tui-empty-content">
              <p>Type in the search box above to find products.</p>
              <p>Or click a category to browse products.</p>
            </div>
          </Box>
          <style>{`
            .tui-empty-state {
              margin-top: 16px;
            }
            .tui-empty-content {
              color: var(--text-muted);
              text-align: center;
              padding: 32px 16px;
            }
            .tui-empty-content p {
              margin: 8px 0;
            }
          `}</style>
        </div>
      )}

      {view === 'search' && (
        <Box title="SEARCH RESULTS">
          {searchResults.length === 0 ? (
            <div className="tui-no-results">
              No products found matching "{searchQuery}"
            </div>
          ) : (
            <div className="tui-product-list">
              {searchResults.map(p => (
                <CompactProductCard 
                  key={p.id} 
                  id={p.id} 
                  name={p.name} 
                  category={p.category} 
                />
              ))}
            </div>
          )}
          <style>{`
            .tui-product-list {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
              gap: 12px;
            }
            @media (max-width: 600px) {
              .tui-product-list {
                grid-template-columns: 1fr;
              }
            }
            .tui-no-results {
              color: var(--text-muted);
              text-align: center;
              padding: 32px 16px;
            }
          `}</style>
        </Box>
      )}

      {view === 'category' && activeCategory && (
        <div className="tui-category-view-box">
          <div className="tui-category-view-title">{activeCategory}</div>
          <div className="tui-product-list">
            {categoryProducts.map(product => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
          <style>{`
            .tui-category-view-box {
              margin: 16px 0;
              border: 1px solid var(--border-color);
              position: relative;
              min-width: 0;
              padding: 20px 16px 16px 16px;
              background: var(--bg-secondary);
            }
            .tui-category-view-box::before {
              content: '';
              position: absolute;
              top: -1px;
              left: 16px;
              right: 16px;
              height: 1px;
              background: var(--bg-primary);
            }
            .tui-category-view-title {
              position: absolute;
              top: -10px;
              left: 24px;
              background: var(--bg-primary);
              padding: 0 8px;
              color: var(--text-primary);
              font-weight: bold;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .tui-product-list {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
              gap: 12px;
            }
            @media (max-width: 600px) {
              .tui-product-list {
                grid-template-columns: 1fr;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

// Compact card component for search results (matches ProductCard compact style)
interface CompactProductCardProps {
  id: string;
  name: string;
  category?: string;
}

function CompactProductCard({ id, name, category }: CompactProductCardProps) {
  return (
    <a href={`/product/${id}/`} className="tui-product-card-link">
      <div className="tui-product-card compact">
        <div className="tui-card-header">
          <span className="tui-card-title">{name}</span>
          {category && <span className="tui-card-category">{category}</span>}
        </div>
        <div className="tui-card-content">
          <div className="tui-card-specs-preview">
            <span className="tui-spec-label">id:</span>
            <span className="tui-spec-count">{id}</span>
          </div>
        </div>
        <div className="tui-card-footer">
          <span className="tui-card-id">{id}</span>
        </div>
      </div>
      <style>{`
        .tui-product-card-link {
          display: block;
          text-decoration: none;
        }
        .tui-product-card {
          border: 1px solid var(--border-dim);
          transition: all 0.15s ease;
          position: relative;
          background: var(--bg-secondary);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .tui-product-card:hover {
          border-color: var(--border-color);
          background: var(--bg-hover);
        }
        .tui-product-card:hover .tui-card-title {
          color: var(--accent-primary);
        }
        .tui-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border-bottom: 1px solid var(--border-dim);
          min-width: 0;
        }
        .tui-card-title {
          color: var(--text-primary);
          font-weight: bold;
          font-size: 14px;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }
        .tui-card-category {
          color: var(--text-muted);
          font-size: 11px;
          flex-shrink: 0;
          background: var(--bg-tertiary);
          padding: 2px 8px;
          border-radius: 3px;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tui-card-content {
          padding: 10px 14px;
          flex: 1;
          min-height: 0;
        }
        .tui-card-specs-preview {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tui-spec-label {
          color: var(--text-muted);
          font-size: 11px;
        }
        .tui-spec-count {
          color: var(--text-primary);
          font-size: 11px;
          font-weight: bold;
        }
        .tui-card-footer {
          padding: 8px 14px;
          border-top: 1px solid var(--border-dim);
          background: var(--bg-tertiary);
          margin-top: auto;
        }
        .tui-card-id {
          color: var(--text-subtle);
          font-size: 10px;
          font-family: inherit;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </a>
  );
}
