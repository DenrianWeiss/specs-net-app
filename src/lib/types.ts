export interface Product {
  id: string;
  name: string;
  image?: string;
  images?: string[];
  specs: Record<string, string | number | boolean | string[]>;
  description?: string;
  category?: string;
  [key: string]: unknown;
}

export interface ProductIndex {
  id: string;
  name: string;
  category?: string;
  searchContent: string;
}

export interface ProcessedImage {
  inputPath: string;
  outputDir: string;
  outputFileName: string;
  productId: string;
}
