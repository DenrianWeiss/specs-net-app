import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Box, SpecTable } from '@/components';
import { getAllProducts, getProductById } from '@/lib/products';
import { parseMarkdown } from '@/lib/markdown';

// Force static generation for all product pages
export const dynamic = 'error';
export const dynamicParams = false;

interface PageProps {
  params: { id: string };
}

// Generate static paths for all products at build time
export function generateStaticParams() {
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
        </Box>

        <SpecTable specs={product.specs} />

        {product.description && (
          <Box title="DESCRIPTION">
            <div 
              className="tui-description"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(product.description) }}
            />
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
      </footer>
    </main>
  );
}
