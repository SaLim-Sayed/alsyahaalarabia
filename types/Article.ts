export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  category: string;
  date: string;
  author: string;
  authorAvatar?: string;
  authorBio?: string;
  authorId: string;
  categoryId: string;
  commentCount: number;
  link?: string;
}

export interface Category {
  id: string;
  name: string;
  originalName?: string;
  image?: any;
  icon?: string;
  count?: number;
}
