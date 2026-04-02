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
      grouped[category] = products.filter(p => {
        if (p.category === category) return true;
        if (p.categories?.includes(category)) return true;
        return false;
      });
    });
    return grouped;
  }, [products, categories]);

  const uncategorizedProducts = useMemo(() =>
    products.filter(p => !p.category && !p.categories),
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
                  categories={p.categories}
                />
              ))}
            </div>
          )}
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
  categories?: string[];
}

function CompactProductCard({ id, name, category, categories }: CompactProductCardProps) {
  const displayCategory = category || categories?.[0];
  return (
    <a href={`/product/${id}/`} className="tui-product-card-link">
      <div className="tui-product-card compact">
        <div className="tui-card-header">
          <span className="tui-card-title">{name}</span>
          {displayCategory && <span className="tui-card-category">{displayCategory}</span>}
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
    </a>
  );
}
