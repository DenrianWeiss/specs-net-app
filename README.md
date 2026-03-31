# PanduSpec - TUI-Style Product Specification Generator

A static website generator that creates Intel ARK-style product listings from markdown files, featuring a black-background TUI (Terminal User Interface) aesthetic.

## Features

- **Markdown-based Products**: Define products with YAML frontmatter for flexible, arbitrary fields
- **Static Export**: Generates fully static HTML sites
- **Real-time Search**: Client-side search across all product data
- **TUI Aesthetic**: Terminal-inspired design with box borders and monospace fonts
- **Category Organization**: Automatic categorization with category navigation

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build static site (output to ./out)
npm run build
```

## Adding Products

Create markdown files in `content/products/` with YAML frontmatter:

```markdown
---
id: product-id
name: Product Name
category: Category Name
image: https://example.com/image.jpg
spec_field_1: value1
spec_field_2: value2
array_field:
  - item1
  - item2
boolean_field: true
number_field: 42
---

Optional markdown description here.

## Headers are supported

- Lists
- Work too

**Bold** and *italic* text with `code` inline.
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Auto-generated | Unique identifier for the product |
| `name` | Yes | Product display name |
| `category` | No | Category for grouping |
| `image` | No | Image URL |
| `description` | No | Can be in frontmatter or markdown body |

All other fields become specifications displayed in the spec table.

## Project Structure

```
panduspec/
├── content/
│   └── products/       # Markdown product files
│       ├── product-1.md
│       └── product-2.md
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── page.tsx    # Home page with listing
│   │   └── product/[id]/page.tsx  # Product detail
│   ├── components/     # TUI-style components
│   │   ├── Box.tsx
│   │   ├── Header.tsx
│   │   ├── ProductCard.tsx
│   │   └── SpecTable.tsx
│   └── lib/
│       ├── products.ts # Product data utilities
│       └── types.ts    # TypeScript types
├── out/                # Generated static site
└── package.json
```

## Customization

### Theme Colors

Edit CSS variables in `src/app/globals.css`:

```css
:root {
  --bg-primary: #0a0a0a;      /* Main background */
  --bg-secondary: #111111;    /* Box backgrounds */
  --border-color: #00ff00;    /* Border color (green) */
  --text-primary: #00ff00;    /* Primary text */
  --accent-cyan: #00ffff;     /* Links, highlights */
  --accent-yellow: #ffff00;   /* Labels, prompts */
}
```

### Adding New Spec Types

The `SpecTable` component automatically detects and displays value types:
- `[bool]` - Boolean values
- `[num]` - Numbers
- `[list]` - Arrays
- `[str]` - Strings

## License

MIT
