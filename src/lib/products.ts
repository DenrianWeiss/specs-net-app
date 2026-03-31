import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Product, ProductIndex, ProcessedImage, HomePageContent } from './types';

const contentDirectory = path.join(process.cwd(), 'content/products');
const rootContentDirectory = path.join(process.cwd(), 'content');
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

function sanitizeId(filename: string): string {
  return filename.replace(/\.md$/, '').replace(/[^a-zA-Z0-9-_]/g, '-');
}

function getRelativePath(fullPath: string, baseDir: string): string {
  const relative = path.relative(baseDir, fullPath);
  return relative.replace(/\\/g, '/');
}

function generateProductId(filePath: string, contentDirectory: string): string {
  const relativePath = getRelativePath(filePath, contentDirectory);
  return sanitizeId(relativePath);
}

function getAllMarkdownFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function findLocalImages(productId: string): string[] {
  // Support nested paths by using the productId as the directory path
  // Replace any URL-encoded characters or sanitization artifacts
  const normalizedId = productId.replace(/-/g, '/');
  
  // Try the direct ID first (for backward compatibility)
  let productImageDir = path.join(contentDirectory, productId);
  
  if (!fs.existsSync(productImageDir)) {
    // Try with normalized path (nested directories)
    productImageDir = path.join(contentDirectory, ...productId.split('/'));
  }

  if (!fs.existsSync(productImageDir)) {
    return [];
  }

  const stat = fs.statSync(productImageDir);
  if (!stat.isDirectory()) {
    return [];
  }

  try {
    const files = fs.readdirSync(productImageDir);
    return files
      .filter(file => imageExtensions.some(ext => file.toLowerCase().endsWith(ext)))
      .map(file => `/images/products/${productId}/${file}`)
      .sort();
  } catch {
    return [];
  }
}

export function getAllProducts(): Product[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const files = getAllMarkdownFiles(contentDirectory);

  return files.map(filePath => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    const id = (data.id as string) || generateProductId(filePath, contentDirectory);

    const specs: Record<string, string | number | boolean | string[]> = {};
    Object.keys(data).forEach(key => {
      if (!['id', 'name', 'image', 'images', 'description', 'category'].includes(key)) {
        specs[key] = data[key];
      }
    });

    // Handle both single image and images array from frontmatter
    let images: string[] = [];
    if (data.images && Array.isArray(data.images)) {
      images = data.images;
    } else if (data.image) {
      images = [data.image];
    }

    // Convert relative image paths to processed paths
    images = images.map(img => {
      if (img.startsWith('./') || img.startsWith('../')) {
        // Relative path - convert to processed image path
        const fileName = path.basename(img);
        const baseName = path.basename(fileName, path.extname(fileName));
        return `/images/products/${id}/${baseName}.webp`;
      }
      return img;
    });

    // Find local images from subfolder and add them
    // For nested products, look for images in a folder matching the product ID
    const localImages = findLocalImages(id);

    // Combine: processed frontmatter images first, then local images
    // For local images, we'll use processed paths
    const processedLocalImages = localImages.map(img => {
      // Convert /images/products/xxx/file.jpg to processed version
      const baseName = path.basename(img, path.extname(img));
      return `/images/products/${id}/${baseName}.webp`;
    });

    // Add only local images that aren't already in the list
    for (const procImg of processedLocalImages) {
      if (!images.includes(procImg)) {
        images.push(procImg);
      }
    }

    return {
      ...data,
      id,
      name: data.name || path.basename(filePath),
      image: images[0],
      images: images.length > 0 ? images : undefined,
      description: data.description || content.trim(),
      category: data.category,
      specs
    };
  });
}

export function getProductById(id: string): Product | undefined {
  const products = getAllProducts();
  return products.find(p => p.id === id);
}

export function getProductIndex(): ProductIndex[] {
  const products = getAllProducts();

  return products.map(product => {
    const categoryParts = [
      product.category || '',
      ...(product.categories || [])
    ];
    const searchParts = [
      product.name,
      ...categoryParts,
      Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join(' '),
      product.description || ''
    ];

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      categories: product.categories,
      searchContent: searchParts.join(' ').toLowerCase()
    };
  });
}

export function getCategories(): string[] {
  const products = getAllProducts();
  const categories = new Set<string>();

  products.forEach(p => {
    if (p.category) {
      categories.add(p.category);
    }
    if (p.categories) {
      p.categories.forEach(cat => categories.add(cat));
    }
  });

  return Array.from(categories).sort();
}

export function getProductsByCategory(category: string): Product[] {
  const products = getAllProducts();
  return products.filter(p => {
    if (p.category === category) return true;
    if (p.categories?.includes(category)) return true;
    return false;
  });
}

// Image processing utilities for build time
export function getImageProcessingList(): ProcessedImage[] {
  const products = getAllProducts();
  const imagesToProcess: ProcessedImage[] = [];

  // Get all markdown files to map IDs back to paths
  const allMarkdownFiles = getAllMarkdownFiles(contentDirectory);
  const idToPathMap = new Map<string, string>();
  for (const filePath of allMarkdownFiles) {
    const id = generateProductId(filePath, contentDirectory);
    const dirPath = path.dirname(filePath);
    const baseName = path.basename(filePath, '.md');
    // Image directory is same name as markdown file in its directory
    const imageDir = path.join(dirPath, baseName);
    idToPathMap.set(id, imageDir);
  }

  for (const product of products) {
    // Try to get the image directory from the ID map
    let productImageDir = idToPathMap.get(product.id);
    
    if (!productImageDir || !fs.existsSync(productImageDir)) {
      // Fall back to direct ID (for backward compatibility)
      productImageDir = path.join(contentDirectory, product.id);
    }

    if (!fs.existsSync(productImageDir)) continue;
    const stat = fs.statSync(productImageDir);
    if (!stat.isDirectory()) continue;

    try {
      const files = fs.readdirSync(productImageDir);
      for (const file of files) {
        if (imageExtensions.some(ext => file.toLowerCase().endsWith(ext))) {
          const inputPath = path.join(productImageDir, file);
          const baseName = path.basename(file, path.extname(file));
          const outputFileName = `${baseName}.webp`;

          imagesToProcess.push({
            inputPath,
            outputDir: product.id,
            outputFileName,
            productId: product.id
          });
        }
      }
    } catch {
      // Skip if can't read directory
    }
  }

  return imagesToProcess;
}

// Home page content utilities
export function getHomePageContent(): HomePageContent | null {
  const indexPath = path.join(rootContentDirectory, 'index.md');
  
  if (!fs.existsSync(indexPath)) {
    return null;
  }
  
  try {
    const fileContent = fs.readFileSync(indexPath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    return {
      title: data.title || 'PanduSpec',
      subtitle: data.subtitle,
      description: data.description,
      content: content.trim(),
      ...data
    };
  } catch {
    return null;
  }
}
