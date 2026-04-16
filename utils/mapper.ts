import { Article, Category } from "../types/Article";
import { WPCategory, WPPost } from "../types/wp-types";

export const mapWPPostToArticle = (post: WPPost): Article => {
  // Extract featured image URL
  let image = "https://via.placeholder.com/800x450?text=No+Image";

  // Prioritize custom rttpg image fields with multiple size fallbacks
  const rttpgImages = post.rttpg_featured_image_url;
  if (rttpgImages) {
    if (rttpgImages.full?.[0]) {
      image = rttpgImages.full[0];
    } else if (rttpgImages.large?.[0]) {
      image = rttpgImages.large[0];
    } else if (rttpgImages.medium?.[0]) {
      image = rttpgImages.medium[0];
    } else if (rttpgImages.landscape?.[0]) {
      image = rttpgImages.landscape[0];
    }
  }

  // Fallback to standard embedded media if rttpg fields are missing or empty
  if (image.includes("placeholder.com")) {
    const embeddedMedia = post._embedded?.["wp:featuredmedia"];
    if (embeddedMedia && embeddedMedia.length > 0) {
      image = embeddedMedia[0].source_url;
    }
  }

  // Extract author details
  let author = post.rttpg_author?.display_name || "مجلة السياحة العربية";
  let authorAvatar =
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop";
  let authorBio = "";

  // Prioritize the post's own thumbnail for the author avatar as requested by the user
  if (post.rttpg_featured_image_url?.thumbnail?.[0]) {
    authorAvatar = post.rttpg_featured_image_url.thumbnail[0];
  }

  const embeddedAuthor = post._embedded?.author;
  if (
    embeddedAuthor &&
    embeddedAuthor.length > 0 &&
    !("code" in embeddedAuthor[0])
  ) {
    // Only use embedded author if it's not an error object and avatar wasn't set by priority
    author =
      author === "مجلة السياحة العربية" ? embeddedAuthor[0].name : author;
    if (
      authorAvatar ===
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
    ) {
      authorAvatar =
        embeddedAuthor[0].avatar_urls?.["96"] ||
        embeddedAuthor[0].avatar_urls?.["48"] ||
        authorAvatar;
    }
    authorBio = embeddedAuthor[0].description || "";
  }

  // Extract primary category name
  let category = "أخبار";
  const embeddedTerms = post._embedded?.["wp:term"];
  if (embeddedTerms && embeddedTerms.length > 0) {
    const categories = embeddedTerms[0];
    if (categories && categories.length > 0) {
      category = categories[0].name;
    }
  }

  // Format date (simple approach)
  const date = new Date(post.date).toLocaleDateString("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    id: post.id.toString(),
    title: decodeHtmlEntities(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered),
    content: post.content.rendered,
    image: image,
    category: category,
    categoryId: (post.categories?.[0] || "0").toString(),
    date: date,
    author: author,
    authorAvatar: authorAvatar,
    authorBio: authorBio,
    authorId: post.author.toString(),
    commentCount: post.rttpg_comment || 0,
    link: post.link,
  };
};

const CATEGORY_IMAGES: Record<string, any> = {
  default: require("../assets/images/categories/default.png"),
  أخبار: require("../assets/images/categories/news.png"),
  سياحة: require("../assets/images/categories/tourism.png"),
  الثقافة: require("../assets/images/categories/culture.png"),
  وجهات: require("../assets/images/categories/tourism.png"), // Reuse for destinations
  فنادق: require("../assets/images/categories/hotels.png"),
  مطاعم: {
    uri: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
  },
  فعاليات: {
    uri: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
  },
  تراث: require("../assets/images/categories/culture.png"),
};

const getCategoryImage = (name: string): any => {
  const normalized = name.trim();
  return CATEGORY_IMAGES[normalized] || CATEGORY_IMAGES["default"];
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

export const mapWPUserToAppUser = (wpUser: any) => {
  return {
    id: wpUser.id.toString(),
    name: wpUser.name,
    email: wpUser.email || "",
    username: wpUser.slug,
    firstName: wpUser.first_name,
    lastName: wpUser.last_name,
    registrationDate: wpUser.registered_date
      ? new Date(wpUser.registered_date).toLocaleDateString("ar-SA", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : undefined,
    avatar: wpUser.avatar_urls?.["96"] || wpUser.avatar_urls?.["48"],
    role: wpUser.roles?.[0],
    description: wpUser.description,
  };
};

// Helpers
const decodeHtmlEntities = (text: string) => {
  if (!text) return "";
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&hellip;/g, "...");
};

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
};
