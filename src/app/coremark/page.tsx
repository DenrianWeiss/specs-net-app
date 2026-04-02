import { Metadata } from 'next';
import { Header, Box, SortableTable } from '@/components';
import { getHomePageContent } from '@/lib/products';
import { parseMarkdown } from '@/lib/markdown';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const metadata: Metadata = {
  title: 'CoreMark Benchmark Results',
  description: 'CPU performance benchmark results using CoreMark',
};

export default function CoreMarkPage() {
  const homeContent = getHomePageContent();

  // Read coremark.md content
  let content = '';
  let title = 'CoreMark Benchmark Results';

  try {
    const filePath = path.join(process.cwd(), 'content/coremark.md');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(fileContent);
    content = parsed.content;
    title = parsed.data.title || title;
  } catch {
    content = 'No benchmark data available.';
  }

  return (
    <main className="tui-main">
      <Header title="PANDUSPEC" />

      <div className="tui-container">
        <nav className="tui-breadcrumb">
          <a href="/">home</a>
          <span className="tui-breadcrumb-sep">/</span>
          <span className="tui-breadcrumb-current">coremark</span>
        </nav>

        <Box title="COREMARK">
          <SortableTable className="tui-coremark-content">
            <div
              dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
            />
          </SortableTable>
        </Box>
      </div>

      <footer className="tui-footer">
        <div className="tui-footer-inner">
          <span className="tui-footer-text">PanduSpec v1.0.0</span>
        </div>
      </footer>
    </main>
  );
}
