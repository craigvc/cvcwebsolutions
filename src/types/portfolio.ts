export interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description?: string;
}

export interface PortfolioImages {
  detail?: string;      // Image for detail page hero
  featured?: string;    // Image for featured card
  listing?: string;     // Image for grid listing
  logo?: string;        // Logo/branding image
}

export interface ImageSettings {
  detail?: { x: number; y: number; scale: number };
  featured?: { x: number; y: number; scale: number };
  listing?: { x: number; y: number; scale: number };
}

export interface PortfolioItem {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  description: string;
  long_description: string;
  challenge?: string;
  solution?: string;
  technologies: string[];
  image_url: string;  // Legacy/default image
  images?: PortfolioImages;  // New multi-image support
  imageSettings?: ImageSettings;  // Position and scale for each image
  live_url: string;
  github_url?: string;
  category: string | PortfolioCategory;
  featured: boolean;
  display_order: number;
  achievements: string[];
  year: string;
  status: 'draft' | 'published';
  published_at?: string;
  created_at: string;
  updated_at: string;
}
