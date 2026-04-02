import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const specCount = Object.keys(product.specs).length;
  const imageCount = product.images?.length || (product.image ? 1 : 0);
  const firstImage = product.images?.[0] || product.image;
  const displayCategory = product.category || product.categories?.[0];
  const categoryCount = (product.categories?.length || 0) + (product.category ? 1 : 0);

  return (
    <Link href={`/product/${product.id}/`} className="tui-product-card-link">
      <div className={`tui-product-card ${compact ? 'compact' : ''}`}>
        <div className="tui-card-header">
          <span className="tui-card-title">{product.name}</span>
          {displayCategory && (
            <span className="tui-card-category">
              {displayCategory}{categoryCount > 1 ? ` +${categoryCount - 1}` : ''}
            </span>
          )}
        </div>
        <div className="tui-card-content">
          {firstImage && (
            <div className="tui-card-image-wrapper">
              <div className="tui-card-image">
                <img src={firstImage} alt={product.name} />
              </div>
              {imageCount > 1 && (
                <div className="tui-image-badge">+{imageCount - 1}</div>
              )}
            </div>
          )}
          {!compact && product.description && (
            <div className="tui-card-description">
              {product.description.slice(0, 150)}
              {product.description.length > 150 ? '...' : ''}
            </div>
          )}
          <div className="tui-card-specs-preview">
            <span className="tui-spec-label">specs:</span>
            <span className="tui-spec-count">{specCount}</span>
          </div>
          {!compact && (
            <div className="tui-card-specs-mini">
              {Object.entries(product.specs).slice(0, 4).map(([key, value]) => (
                <div key={key} className="tui-spec-row-mini">
                  <span className="tui-spec-key">{key}:</span>
                  <span className="tui-spec-value">{String(value).slice(0, 20)}</span>
                </div>
              ))}
              {specCount > 4 && (
                <div className="tui-spec-more">+{specCount - 4} more</div>
              )}
            </div>
          )}
        </div>
        <div className="tui-card-footer">
          <span className="tui-card-id">{product.id}</span>
        </div>
      </div>
    </Link>
  );
}
