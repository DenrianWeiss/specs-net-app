import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Box, SpecTable } from '@/components';
import { getAllProducts, getProductById } from '@/lib/products';

interface PageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map(product => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = getProductById(params.id);
  if (!product) {
    return { title: 'Product Not Found' };
  }
  return {
    title: `${product.name} - PanduSpec`,
  };
}

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
  
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[123]>)/g, '$1');
  html = html.replace(/(<\/h[123]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  
  return html;
}

export default function ProductPage({ params }: PageProps) {
  const product = getProductById(params.id);
  
  if (!product) {
    notFound();
  }

  const images = product.images || (product.image ? [product.image] : []);
  const hasGallery = images.length > 0;

  return (
    <main className="tui-main">
      <Header title="PANDUSPEC" />
      
      <div className="tui-container">
        <nav className="tui-breadcrumb">
          <a href="/">home</a>
          <span className="tui-breadcrumb-sep">/</span>
          {(product.category || product.categories) && (
            <>
              {product.category && (
                <a href={`/#category-${product.category.replace(/\s+/g, '-')}`}>{product.category}</a>
              )}
              {product.categories?.map((cat, idx) => (
                <span key={cat}>
                  {product.category || idx > 0 ? <span className="tui-breadcrumb-sep">,</span> : null}
                  <a href={`/#category-${cat.replace(/\s+/g, '-')}`}>{cat}</a>
                </span>
              ))}
              <span className="tui-breadcrumb-sep">/</span>
            </>
          )}
          <span className="tui-breadcrumb-current">{product.name}</span>
          <style>{`
            .tui-breadcrumb {
              color: var(--text-muted);
              font-size: 12px;
              margin-bottom: 16px;
            }
            .tui-breadcrumb a {
              color: var(--text-secondary);
            }
            .tui-breadcrumb a:hover {
              text-decoration: none;
              color: var(--accent-primary);
            }
            .tui-breadcrumb-sep {
              margin: 0 8px;
              color: var(--border-dim);
            }
            .tui-breadcrumb-current {
              color: var(--text-primary);
            }
          `}</style>
        </nav>

        <Box title={product.name}>
          <div className="tui-product-header">
            <div className="tui-product-info">
              <div className="tui-product-id">
                <span className="tui-label">id</span>
                <span className="tui-value">{product.id}</span>
              </div>
              {(product.category || product.categories) && (
                <div className="tui-product-category">
                  <span className="tui-label">category</span>
                  <span className="tui-value">
                    {product.category}
                    {product.categories?.map((cat, idx) => (
                      <span key={cat}>
                        {product.category || idx > 0 ? ', ' : ''}{cat}
                      </span>
                    ))}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {hasGallery && (
            <div className="tui-gallery" data-images={JSON.stringify(images)}>
              <div className="tui-gallery-main">
                <img 
                  id="gallery-main-image" 
                  src={images[0]} 
                  alt={product.name}
                  className="tui-gallery-main-img"
                />
                <button className="tui-gallery-zoom" aria-label="Enlarge image">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                    <path d="M11 8v6M8 11h6"/>
                  </svg>
                </button>
              </div>
              
              {images.length > 1 && (
                <div className="tui-gallery-thumbnails">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      className={`tui-gallery-thumb ${idx === 0 ? 'active' : ''}`}
                      data-index={idx}
                      data-src={img}
                    >
                      <img src={img} alt={`${product.name} - ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
              
              <div className="tui-gallery-counter">
                <span id="gallery-current">1</span> / <span>{images.length}</span>
              </div>
            </div>
          )}
          
          <style>{`
            .tui-product-header {
              display: flex;
              gap: 24px;
              flex-wrap: wrap;
              margin-bottom: 16px;
            }
            .tui-product-info {
              flex: 1;
              min-width: 200px;
            }
            .tui-product-id, .tui-product-category {
              margin-bottom: 12px;
            }
            .tui-label {
              color: var(--text-muted);
              margin-right: 12px;
              font-size: 12px;
            }
            .tui-value {
              color: var(--text-primary);
            }
            .tui-gallery {
              margin-top: 16px;
            }
            .tui-gallery-main {
              position: relative;
              border: 1px solid var(--border-dim);
              background: var(--bg-tertiary);
              padding: 8px;
              cursor: zoom-in;
              transition: border-color 0.15s;
            }
            .tui-gallery-main:hover {
              border-color: var(--border-color);
            }
            .tui-gallery-main-img {
              width: 100%;
              max-height: 400px;
              object-fit: contain;
              display: block;
              background: var(--bg-primary);
            }
            .tui-gallery-zoom {
              position: absolute;
              top: 16px;
              right: 16px;
              width: 40px;
              height: 40px;
              background: var(--bg-primary);
              border: 1px solid var(--border-dim);
              color: var(--text-secondary);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.15s;
            }
            .tui-gallery-zoom:hover {
              border-color: var(--border-color);
              color: var(--text-primary);
            }
            .tui-gallery-thumbnails {
              display: flex;
              gap: 8px;
              margin-top: 12px;
              flex-wrap: wrap;
            }
            .tui-gallery-thumb {
              width: 64px;
              height: 64px;
              border: 1px solid var(--border-dim);
              background: var(--bg-tertiary);
              padding: 4px;
              cursor: pointer;
              transition: all 0.15s;
            }
            .tui-gallery-thumb:hover {
              border-color: var(--border-color);
            }
            .tui-gallery-thumb.active {
              border-color: var(--accent-primary);
              background: var(--bg-primary);
            }
            .tui-gallery-thumb img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }
            .tui-gallery-counter {
              text-align: center;
              color: var(--text-muted);
              font-size: 12px;
              margin-top: 8px;
            }
          `}</style>
        </Box>

        <SpecTable specs={product.specs} />

        {product.description && (
          <Box title="DESCRIPTION">
            <div 
              className="tui-description"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(product.description) }}
            />
            <style>{`
              .tui-description {
                color: var(--text-secondary);
                line-height: 1.7;
              }
              .tui-description h1, .tui-description h2, .tui-description h3 {
                color: var(--text-primary);
                margin: 20px 0 12px 0;
                font-weight: 600;
              }
              .tui-description h1 { font-size: 18px; }
              .tui-description h2 { font-size: 16px; }
              .tui-description h3 { font-size: 14px; }
              .tui-description p {
                margin: 12px 0;
              }
              .tui-description ul {
                margin: 12px 0;
                padding-left: 24px;
              }
              .tui-description li {
                margin: 6px 0;
              }
              .tui-description code {
                background: var(--bg-tertiary);
                color: var(--text-primary);
                padding: 2px 8px;
                font-size: 12px;
                border: 1px solid var(--border-dim);
              }
              .tui-description strong {
                color: var(--text-primary);
                font-weight: 600;
              }
              .tui-description em {
                color: var(--text-secondary);
                font-style: italic;
              }
            `}</style>
          </Box>
        )}

        <Box title="RAW DATA">
          <div className="tui-raw-data">
            <div className="tui-raw-header">
              <span className="tui-raw-filename">{product.id}.md</span>
              <span className="tui-raw-type">YAML Frontmatter</span>
            </div>
            <pre className="tui-raw-content">
              <code>{`---
id: ${product.id}
name: ${product.name}${product.category ? `\ncategory: ${product.category}` : ''}${images.length > 0 ? `\nimages:\n${images.map(img => `  - ${img}`).join('\n')}` : ''}
${Object.entries(product.specs).map(([k, v]) => {
  if (Array.isArray(v)) {
    return `${k}:\n${v.map(item => `  - ${item}`).join('\n')}`;
  }
  if (typeof v === 'object' && v !== null) {
    return `${k}:\n${Object.entries(v).map(([sk, sv]) => `  ${sk}: ${sv}`).join('\n')}`;
  }
  return `${k}: ${v}`;
}).join('\n')}
---

${product.description || ''}`}</code>
            </pre>
          </div>
          <style>{`
            .tui-raw-data {
              background: var(--bg-tertiary);
              border: 1px solid var(--border-dim);
            }
            .tui-raw-header {
              padding: 10px 14px;
              border-bottom: 1px solid var(--border-dim);
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .tui-raw-filename {
              color: var(--text-primary);
              font-weight: 500;
            }
            .tui-raw-type {
              color: var(--text-muted);
              font-size: 11px;
            }
            .tui-raw-content {
              margin: 0;
              padding: 14px;
              overflow-x: auto;
              color: var(--text-secondary);
              font-size: 12px;
              line-height: 1.6;
            }
            .tui-raw-content code {
              background: transparent;
              font-family: inherit;
            }
          `}</style>
        </Box>
      </div>

      {/* Lightbox Modal */}
      {hasGallery && (
        <div id="lightbox" className="tui-lightbox">
          <div className="tui-lightbox-backdrop" />
          <button className="tui-lightbox-close" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
          <button className="tui-lightbox-prev" aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button className="tui-lightbox-next" aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
          <div className="tui-lightbox-content">
            <img id="lightbox-image" src="" alt="" />
          </div>
          <div className="tui-lightbox-counter">
            <span id="lightbox-current">1</span> / <span>{images.length}</span>
          </div>
          <style>{`
            .tui-lightbox {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 1000;
              display: none;
              align-items: center;
              justify-content: center;
            }
            .tui-lightbox.active {
              display: flex;
            }
            .tui-lightbox-backdrop {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.9);
              cursor: pointer;
            }
            .tui-lightbox-close {
              position: absolute;
              top: 20px;
              right: 20px;
              width: 44px;
              height: 44px;
              background: var(--bg-secondary);
              border: 1px solid var(--border-dim);
              color: var(--text-secondary);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              z-index: 1001;
              transition: all 0.15s;
            }
            .tui-lightbox-close:hover {
              border-color: var(--border-color);
              color: var(--text-primary);
            }
            .tui-lightbox-prev,
            .tui-lightbox-next {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              width: 44px;
              height: 44px;
              background: var(--bg-secondary);
              border: 1px solid var(--border-dim);
              color: var(--text-secondary);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              z-index: 1001;
              transition: all 0.15s;
            }
            .tui-lightbox-prev:hover,
            .tui-lightbox-next:hover {
              border-color: var(--border-color);
              color: var(--text-primary);
            }
            .tui-lightbox-prev {
              left: 20px;
            }
            .tui-lightbox-next {
              right: 20px;
            }
            .tui-lightbox-content {
              position: relative;
              z-index: 1001;
              max-width: 90vw;
              max-height: 85vh;
              padding: 20px;
            }
            .tui-lightbox-content img {
              max-width: 100%;
              max-height: 80vh;
              object-fit: contain;
              display: block;
              border: 1px solid var(--border-dim);
            }
            .tui-lightbox-counter {
              position: absolute;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
              background: var(--bg-secondary);
              border: 1px solid var(--border-dim);
              padding: 8px 16px;
              color: var(--text-secondary);
              font-size: 14px;
              z-index: 1001;
            }
            @media (max-width: 640px) {
              .tui-lightbox-prev {
                left: 10px;
              }
              .tui-lightbox-next {
                right: 10px;
              }
              .tui-lightbox-prev,
              .tui-lightbox-next {
                width: 36px;
                height: 36px;
              }
            }
          `}</style>
        </div>
      )}

      {/* Gallery JavaScript */}
      {hasGallery && (
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            const gallery = document.querySelector('.tui-gallery');
            if (!gallery) return;
            
            const images = JSON.parse(gallery.dataset.images || '[]');
            const mainImage = document.getElementById('gallery-main-image');
            const thumbs = gallery.querySelectorAll('.tui-gallery-thumb');
            const counterCurrent = document.getElementById('gallery-current');
            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.getElementById('lightbox-image');
            const lightboxCurrent = document.getElementById('lightbox-current');
            let currentIndex = 0;
            
            function updateImage(index) {
              currentIndex = index;
              mainImage.src = images[index];
              counterCurrent.textContent = index + 1;
              
              thumbs.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
              });
            }
            
            function openLightbox(index) {
              currentIndex = index;
              lightboxImage.src = images[index];
              lightboxCurrent.textContent = index + 1;
              lightbox.classList.add('active');
              document.body.style.overflow = 'hidden';
            }
            
            function closeLightbox() {
              lightbox.classList.remove('active');
              document.body.style.overflow = '';
            }
            
            function nextImage() {
              const next = (currentIndex + 1) % images.length;
              openLightbox(next);
            }
            
            function prevImage() {
              const prev = (currentIndex - 1 + images.length) % images.length;
              openLightbox(prev);
            }
            
            // Thumbnail clicks
            thumbs.forEach((thumb, index) => {
              thumb.addEventListener('click', () => updateImage(index));
            });
            
            // Main image click to open lightbox
            gallery.querySelector('.tui-gallery-main').addEventListener('click', () => {
              openLightbox(currentIndex);
            });
            
            // Lightbox controls
            lightbox.querySelector('.tui-lightbox-close').addEventListener('click', closeLightbox);
            lightbox.querySelector('.tui-lightbox-backdrop').addEventListener('click', closeLightbox);
            lightbox.querySelector('.tui-lightbox-next').addEventListener('click', (e) => {
              e.stopPropagation();
              nextImage();
            });
            lightbox.querySelector('.tui-lightbox-prev').addEventListener('click', (e) => {
              e.stopPropagation();
              prevImage();
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
              if (!lightbox.classList.contains('active')) return;
              
              if (e.key === 'Escape') closeLightbox();
              if (e.key === 'ArrowRight') nextImage();
              if (e.key === 'ArrowLeft') prevImage();
            });
          })();
        `}} />
      )}

      <footer className="tui-footer">
        <div className="tui-footer-inner">
          <span className="tui-footer-text">PanduSpec v1.0.0 · <a href="/">back to index</a></span>
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
          .tui-footer-text a {
            color: var(--text-secondary);
          }
          .tui-footer-text a:hover {
            color: var(--accent-primary);
          }
        `}</style>
      </footer>
    </main>
  );
}
