export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  category: string;
  date: string;
  author: string;
  categoryId: string;
  link?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  count?: number;
}
