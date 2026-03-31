export interface Product {
  id: string;
  name: string;
  image?: string;
  images?: string[];
  specs: Record<string, unknown>;
  description?: string;
  category?: string;
  categories?: string[];
  [key: string]: unknown;
}

export interface ProductIndex {
  id: string;
  name: string;
  category?: string;
  categories?: string[];
  searchContent: string;
}

export interface ProcessedImage {
  inputPath: string;
  outputDir: string;
  outputFileName: string;
  productId: string;
}

export interface HomePageContent {
  title: string;
  subtitle?: string;
  description?: string;
  content: string;
  [key: string]: unknown;
}
