import { Article, Category } from '../types/Article';
import { WPPost, WPCategory } from '../types/wp-types';

export const mapWPPostToArticle = (post: WPPost): Article => {
  // Extract featured image URL
  let image = 'https://via.placeholder.com/800x450?text=No+Image';
  const embeddedMedia = post._embedded?.['wp:featuredmedia'];
  if (embeddedMedia && embeddedMedia.length > 0) {
    image = embeddedMedia[0].source_url;
  }

  // Extract author name
  let author = 'مجلة السياحة العربية';
  const embeddedAuthor = post._embedded?.author;
  if (embeddedAuthor && embeddedAuthor.length > 0) {
    author = embeddedAuthor[0].name;
  }

  // Extract primary category name
  let category = 'أخبار';
  const embeddedTerms = post._embedded?.['wp:term'];
  if (embeddedTerms && embeddedTerms.length > 0) {
    const categories = embeddedTerms[0];
    if (categories && categories.length > 0) {
      category = categories[0].name;
    }
  }

  // Format date (simple approach)
  const date = new Date(post.date).toLocaleDateString('ar-SA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return {
    id: post.id.toString(),
    title: decodeHtmlEntities(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered),
    content: post.content.rendered,
    image: image,
    category: category,
    categoryId: (post.categories?.[0] || '0').toString(),
    date: date,
    author: author,
    link: post.link,
  };
};

const CATEGORY_IMAGES: Record<string, any> = {
  'default': require('../assets/images/categories/default.png'),
  'أخبار': require('../assets/images/categories/news.png'),
  'سياحة': require('../assets/images/categories/tourism.png'),
  'الثقافة': require('../assets/images/categories/culture.png'),
  'وجهات': require('../assets/images/categories/tourism.png'), // Reuse for destinations
  'فنادق': require('../assets/images/categories/hotels.png'),
  'مطاعم': { uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop' },
  'فعاليات': { uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop' },
  'تراث': require('../assets/images/categories/culture.png'),
};

const getCategoryImage = (name: string): any => {
  const normalized = name.trim();
  return CATEGORY_IMAGES[normalized] || CATEGORY_IMAGES['default'];
};

export const mapWPCategoryToAppCategory = (wpCat: WPCategory): Category => {
  const name = decodeHtmlEntities(wpCat.name);
  return {
    id: wpCat.id.toString(),
    name: name,
    originalName: name, // Keep the source name for icon lookups
    count: wpCat.count,
    image: getCategoryImage(name),
  };
};

// Helpers
const decodeHtmlEntities = (text: string) => {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&hellip;/g, '...');
};

const stripHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
};
