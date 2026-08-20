export interface ProjectResult {
  title: string;
  description: string;
  imageUrl: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  short_description: string;
  overview?: string;
  challenge?: string;
  services: string[];
  technical_stack: string[];
  image_url: string;
  cover_image?: string;
  project_url?: string;
  website?: string;
  category: string;
  results?: ProjectResult[];
  created_at?: string;
}
