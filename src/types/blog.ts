export interface Blog {
  id: string;
  title: string;
  short_description: string;
  category: string;
  date: string;
  image_url: string;
  cover_image?: string;
  content: string;
  author: string;
  tags: string[];
  related_posts?: string[];
  created_at?: string;
}
