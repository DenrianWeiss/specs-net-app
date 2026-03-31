# AGENTS.md - PanduSpec Project Guide

Essential information for AI agents working in this codebase.

## Project Overview

**PanduSpec** is a static site generator that creates Intel ARK-style product specification listings from markdown files. It features a TUI (Terminal User Interface) aesthetic with box-drawing characters, monospace fonts, and a black/green color scheme.

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Output**: Static HTML export (`out/` directory)
- **Styling**: CSS-in-JS (inline `<style>` tags) + CSS variables

## Essential Commands

```bash
# Development server
npm run dev

# Build static site (outputs to ./out)
npm run build

# Start production server (requires build first)
npm start
```

## Project Structure

```
panduspec/
├── content/products/       # Product markdown files (data source)
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── page.tsx       # Home page with search & categories
│   │   ├── layout.tsx     # Root layout with fonts
│   │   ├── globals.css    # Global styles & CSS variables
│   │   └── product/[id]/  # Dynamic product detail pages
│   ├── components/        # TUI-style React components
│   │   ├── Box.tsx        # Bordered container component
│   │   ├── Header.tsx     # Site header with nav
│   │   ├── ProductCard.tsx # Product listing card
│   │   ├── SpecTable.tsx  # Specification display table
│   │   └── index.ts       # Component exports
│   └── lib/
│       ├── products.ts    # Product data utilities (file-based)
│       └── types.ts       # TypeScript interfaces
├── next.config.js         # Static export config
├── tsconfig.json          # Path alias: @/* → ./src/*
└── out/                   # Generated static site (gitignored)
```

## Code Patterns & Conventions

### Component Structure

Components follow this pattern:
- Use TypeScript interfaces for props
- CSS is defined inline via `<style>{\`...\`}</style>` tags (not CSS modules)
- CSS class names use `tui-` prefix
- Components are exported from `src/components/index.ts`

```tsx
interface BoxProps {
  title?: string;
  children: React.ReactNode;
}

export function Box({ title, children }: BoxProps) {
  return (
    <div className="tui-box">
      {/* JSX */}
      <style>{\`
        .tui-box { /* styles */ }
      \`}</style>
    </div>
  );
}
```

### TUI Aesthetic Patterns

- **Box borders**: Use box-drawing characters (`┌─┐│└┘╔═╗║╝╚`)
- **Colors**: Reference CSS variables, never hardcode
  - `--border-color` (green): Primary borders
  - `--accent-cyan`: Links, titles
  - `--accent-yellow`: Labels, highlights
  - `--text-muted`: Secondary text
- **Font**: Monospace only (JetBrains Mono, Fira Code, Consolas fallback)

### CSS Variables (globals.css)

```css
--bg-primary: #0a0a0a;      /* Main background */
--bg-secondary: #111111;    /* Box backgrounds */
--bg-tertiary: #1a1a1a;     /* Elevated surfaces */
--border-color: #00ff00;    /* Primary borders (green) */
--border-dim: #006600;      /* Subtle borders */
--text-primary: #00ff00;    /* Primary text */
--text-secondary: #00cc00;  /* Secondary text */
--text-muted: #008800;      /* Muted text */
--accent-cyan: #00ffff;     /* Links, highlights */
--accent-yellow: #ffff00;   /* Labels, prompts */
```

### Import Paths

Use the `@/*` path alias for all internal imports:

```tsx
import { Box } from '@/components';
import { getAllProducts } from '@/lib/products';
import { Product } from '@/lib/types';
```

## Product Data System

### Adding Products

Create markdown files in `content/products/` with YAML frontmatter:

```markdown
---
id: unique-id
name: Product Name
category: Category Name
image: https://example.com/image.jpg
any_spec_field: value
array_field:
  - item1
  - item2
number_field: 42
boolean_field: true
---

Optional markdown description.
```

### Reserved Frontmatter Fields

These fields have special handling:
- `id`: Unique identifier (auto-generated from filename if omitted)
- `name`: Product display name (required)
- `category`: Grouping category
- `image`: Product image URL
- `description`: Can be in frontmatter OR markdown body

All other fields become specifications in the spec table.

### Product Utilities (src/lib/products.ts)

```ts
getAllProducts()           // All products with specs
getProductById(id)         // Single product
getProductIndex()          // Search index (id, name, category, searchContent)
getCategories()            // Unique category names
getProductsByCategory(cat) // Filtered by category
```

## Static Export Configuration

The site is configured for static export in `next.config.js`:

```js
output: 'export',      // Generates static HTML
trailingSlash: true,   // URLs end with /
images: {
  unoptimized: true    // Required for static export
}
```

Dynamic routes (`product/[id]/`) use `generateStaticParams()` to pre-render all product pages at build time.

## Search Implementation

Search is client-side only using a simple string match approach:
- Search index is embedded in the HTML via `data-search-index` attribute
- Vanilla JavaScript handles filtering (no React state for search)
- Results replace the product list dynamically

## TypeScript Types

```ts
// src/lib/types.ts
interface Product {
  id: string;
  name: string;
  image?: string;
  specs: Record<string, string | number | boolean | string[]>;
  description?: string;
  category?: string;
  [key: string]: unknown;
}

interface ProductIndex {
  id: string;
  name: string;
  category?: string;
  searchContent: string;
}
```

## Common Tasks

### Adding a New Component

1. Create component in `src/components/ComponentName.tsx`
2. Add export to `src/components/index.ts`
3. Use `tui-` prefixed class names
4. Include scoped `<style>` tag

### Adding a New Page

1. Create `src/app/route-name/page.tsx`
2. Use `generateMetadata()` for page titles
3. Import `Header` component for consistent navigation
4. Wrap content in `tui-container` class div

### Adding a New Product

1. Create markdown file in `content/products/`
2. Include at minimum: `name` field
3. Use kebab-case for filenames (becomes default id)
4. Rebuild to generate static pages

## Important Gotchas

1. **CSS-in-JS Pattern**: Components use inline `<style>` tags, not CSS modules or styled-components. This is intentional for the TUI aesthetic.

2. **Images**: Must use `unoptimized: true` in next.config.js for static export. External image URLs are used (Unsplash, etc.).

3. **Search is Client-Side**: The search feature uses vanilla JS embedded in the HTML, not React state. See `page.tsx` lines 272-336 for the implementation.

4. **No API Routes**: This is a fully static site - no server-side API. All data comes from markdown files at build time.

5. **Markdown Parsing**: Product pages include a simple markdown parser (`parseMarkdown()` in `product/[id]/page.tsx`) for descriptions. It only supports basic formatting: headers, bold, italic, code, lists.

6. **Static Params Required**: Dynamic routes must implement `generateStaticParams()` for static export to work.

7. **Fuse.js Installed but Not Used**: The fuse.js package is in dependencies but search uses simple string matching. You may implement fuzzy search if needed.

## Dependencies

Key packages:
- `next` ^14.2.0 - Framework
- `gray-matter` ^4.0.3 - Parse YAML frontmatter
- `marked` ^12.0.0 - Markdown parsing (available but custom parser used)
- `fuse.js` ^7.0.0 - Fuzzy search (installed, not currently used)

## Build Output

The `out/` directory contains:
- `index.html` - Home page
- `product/[id]/index.html` - Product detail pages
- Static assets in `_next/` directory

Serve the `out/` directory with any static file server.
