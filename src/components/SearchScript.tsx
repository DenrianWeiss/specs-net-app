'use client';

import { useEffect } from 'react';

interface ProductIndex {
  id: string;
  name: string;
  category?: string;
  searchContent: string;
}

interface SearchScriptProps {
  productIndex: ProductIndex[];
}

export function SearchScript({ productIndex }: SearchScriptProps) {
  useEffect(() => {
    const searchIndex = productIndex;
    const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
    const searchResultsContainer = document.getElementById('search-results');
    const searchResultsList = document.getElementById('search-results-list');
    const searchResultsCount = document.getElementById('search-results-count');
    const allProducts = document.getElementById('all');
    const categoriesSection = document.getElementById('categories-box');
    const emptyState = document.getElementById('empty-state');
    const categoryView = document.getElementById('category-view');
    const categoryViewTitle = document.getElementById('category-view-title');
    const categoryViewList = document.getElementById('category-view-list');

    if (!searchInput || !searchResultsContainer || !searchResultsList || !searchResultsCount || !allProducts || !emptyState || !categoryView || !categoryViewTitle || !categoryViewList) {
      console.error('Required DOM elements not found');
      return;
    }

    // Category button handlers
    const categoryButtons = document.querySelectorAll('.tui-category-link');
    categoryButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = (btn as HTMLElement).dataset.category;
        if (category) {
          showCategory(category);
        }
      });
    });

    function showCategory(category: string) {
      // Get products for this category
      const categoryProducts = searchIndex.filter((p) => p.category === category);

      // Hide other views
      emptyState!.style.display = 'none';
      allProducts!.style.display = 'none';
      searchResultsContainer!.style.display = 'none';

      // Show category view
      categoryView!.style.display = 'block';
      categoryViewTitle!.textContent = category;

      // Render products
      categoryViewList!.innerHTML = categoryProducts
        .map(
          (p) =>
            `<div class="tui-card-wrapper">` +
            `<a href="/product/${p.id}/" class="tui-product-card-link">` +
            `<div class="tui-product-card compact">` +
            `<div class="tui-card-header">` +
            `<span class="tui-card-title">${escapeHtml(p.name)}</span>` +
            (p.category ? `<span class="tui-card-category">${escapeHtml(p.category)}</span>` : '') +
            `</div>` +
            `<div class="tui-card-content">` +
            `<div class="tui-card-specs-preview">` +
            `<span class="tui-spec-label">id:</span>` +
            `<span class="tui-spec-count">${p.id}</span>` +
            `</div>` +
            `</div>` +
            `<div class="tui-card-footer">` +
            `<span class="tui-card-id">${p.id}</span>` +
            `</div>` +
            `</div>` +
            `</a>` +
            `</div>`
        )
        .join('');

      searchResultsCount!.textContent = categoryProducts.length + ' items';
      searchInput!.value = '';
    }

    function escapeHtml(str: string): string {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function search(query: string) {
      query = query.trim();

      if (!query || query.length < 1) {
        // Reset to empty state
        searchResultsContainer!.style.display = 'none';
        allProducts!.style.display = 'none';
        categoryView!.style.display = 'none';
        if (categoriesSection) categoriesSection.style.display = 'block';
        emptyState!.style.display = 'block';
        searchResultsCount!.textContent = '';
        return;
      }

      const q = query.toLowerCase();
      const matches = searchIndex.filter(
        (p) =>
          p.searchContent.indexOf(q) !== -1 ||
          p.name.toLowerCase().indexOf(q) !== -1 ||
          p.id.toLowerCase().indexOf(q) !== -1
      );

      searchResultsContainer!.style.display = 'block';
      allProducts!.style.display = 'none';
      categoryView!.style.display = 'none';
      emptyState!.style.display = 'none';
      if (categoriesSection) categoriesSection.style.display = 'none';
      searchResultsCount!.textContent = matches.length + ' results';

      if (matches.length === 0) {
        searchResultsList!.innerHTML =
          '<div class="tui-no-results">No products found matching "' +
          escapeHtml(query) +
          '"</div>';
        return;
      }

      // Add no-results style if not present
      if (!document.getElementById('tui-no-results-style')) {
        const style = document.createElement('style');
        style.id = 'tui-no-results-style';
        style.textContent =
          '.tui-no-results { color: var(--text-muted); text-align: center; padding: 32px 16px; }';
        document.head.appendChild(style);
      }

      searchResultsList!.innerHTML = matches
        .map(
          (p) =>
            `<div class="tui-card-wrapper">` +
            `<a href="/product/${p.id}/" class="tui-product-card-link">` +
            `<div class="tui-product-card compact">` +
            `<div class="tui-card-header">` +
            `<span class="tui-card-title">${escapeHtml(p.name)}</span>` +
            (p.category ? `<span class="tui-card-category">${escapeHtml(p.category)}</span>` : '') +
            `</div>` +
            `<div class="tui-card-content">` +
            `<div class="tui-card-specs-preview">` +
            `<span class="tui-spec-label">id:</span>` +
            `<span class="tui-spec-count">${p.id}</span>` +
            `</div>` +
            `</div>` +
            `<div class="tui-card-footer">` +
            `<span class="tui-card-id">${p.id}</span>` +
            `</div>` +
            `</div>` +
            `</a>` +
            `</div>`
        )
        .join('');
    }

    const handleInput = (e: Event) => {
      search((e.target as HTMLInputElement).value);
    };

    searchInput.addEventListener('input', handleInput);

    // Handle URL hash for direct category links
    if (window.location.hash) {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('category-')) {
        const categoryName = hash.replace('category-', '').replace(/-/g, ' ');
        // Find matching category button and click it
        const matchingBtn = Array.from(categoryButtons).find((btn) => {
          return (btn as HTMLElement).dataset.category?.toLowerCase() === categoryName.toLowerCase();
        });
        if (matchingBtn) {
          (matchingBtn as HTMLElement).click();
        }
      }
    }

    return () => {
      searchInput.removeEventListener('input', handleInput);
    };
  }, [productIndex]);

  return null;
}
