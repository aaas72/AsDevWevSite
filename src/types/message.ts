export interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}
