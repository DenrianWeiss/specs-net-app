import { marked } from 'marked';
import extendedTables from 'marked-extended-tables';

// Configure marked with extended tables support
marked.use(extendedTables());

/**
 * Parse markdown content to HTML using marked library
 */
export function parseMarkdown(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }
  return marked.parse(content, {
    async: false,
    gfm: true,
    breaks: true,
  }) as string;
}
