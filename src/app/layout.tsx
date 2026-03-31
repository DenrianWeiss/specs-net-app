import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PanduSpec - Product Specification Database',
  description: 'TUI-style product specification browser',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          @font-face {
            font-family: 'Maple Mono';
            src: url('/fonts/MapleMono-Regular.ttf.woff2') format('woff2');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Maple Mono';
            src: url('/fonts/MapleMono-Bold.ttf.woff2') format('woff2');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Maple Mono';
            src: url('/fonts/MapleMono-Italic.ttf.woff2') format('woff2');
            font-weight: 400;
            font-style: italic;
            font-display: swap;
          }
          @font-face {
            font-family: 'Maple Mono';
            src: url('/fonts/MapleMono-BoldItalic.ttf.woff2') format('woff2');
            font-weight: 700;
            font-style: italic;
            font-display: swap;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
