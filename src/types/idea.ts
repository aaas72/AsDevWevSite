export interface Idea {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'in_progress' | 'completed' | 'ignored';
  category: 'idea' | 'plan' | 'task';
  created_at?: string;
}
