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
  
  return (
    <Link href={`/product/${product.id}/`} className="tui-product-card-link">
      <div className={`tui-product-card ${compact ? 'compact' : ''}`}>
        <div className="tui-card-header">
          <span className="tui-card-title">{product.name}</span>
          {product.category && (
            <span className="tui-card-category">{product.category}</span>
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
          padding: 14px;
          flex: 1;
          min-height: 0;
        }
        .tui-card-image-wrapper {
          float: right;
          margin-left: 12px;
          margin-bottom: 8px;
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          border: 1px solid var(--border-dim);
          background: var(--bg-tertiary);
          overflow: hidden;
          position: relative;
        }
        .tui-card-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tui-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .tui-image-badge {
          position: absolute;
          bottom: 4px;
          right: 4px;
          background: var(--bg-primary);
          color: var(--text-secondary);
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 3px;
          border: 1px solid var(--border-dim);
        }
        .tui-card-description {
          color: var(--text-secondary);
          font-size: 12px;
          margin-bottom: 12px;
          line-height: 1.5;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
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
        .tui-card-specs-mini {
          border-top: 1px solid var(--border-dim);
          padding-top: 10px;
          margin-top: 10px;
        }
        .tui-spec-row-mini {
          display: flex;
          gap: 8px;
          font-size: 12px;
          margin: 4px 0;
        }
        .tui-spec-key {
          color: var(--text-muted);
          min-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tui-spec-value {
          color: var(--text-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tui-spec-more {
          color: var(--text-subtle);
          font-size: 11px;
          margin-top: 4px;
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
        .tui-product-card.compact .tui-card-content {
          padding: 10px 14px;
        }
        .tui-product-card.compact .tui-card-image-wrapper {
          width: 48px;
          height: 48px;
        }
        .tui-product-card.compact .tui-card-specs-mini {
          display: none;
        }
        .tui-product-card.compact .tui-card-description {
          display: none;
        }
        @media (max-width: 480px) {
          .tui-card-image-wrapper {
            width: 60px;
            height: 60px;
          }
          .tui-card-category {
            max-width: 80px;
          }
        }
      `}</style>
    </Link>
  );
}
