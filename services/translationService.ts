import axios from 'axios';

const GOOGLE_TRANSLATE_API = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=";

const translationCache: Record<string, string> = {};

/**
 * Splits a text into chunks of roughly maxChars, ensuring we split at safe boundaries.
 */
const splitIntoChunks = (text: string, maxChars: number = 2000): string[] => {
  if (text.length <= maxChars) return [text];

  const chunks: string[] = [];
  let currentText = text;

  while (currentText.length > 0) {
    if (currentText.length <= maxChars) {
      chunks.push(currentText);
      break;
    }

    // Try to find a safe split point (end of tag, or newline)
    let splitIndex = currentText.lastIndexOf("</p>", maxChars);
    if (splitIndex === -1)
      splitIndex = currentText.lastIndexOf("</div>", maxChars);
    if (splitIndex === -1)
      splitIndex = currentText.lastIndexOf("</h2>", maxChars);
    if (splitIndex === -1) splitIndex = currentText.lastIndexOf("\n", maxChars);
    if (splitIndex === -1) splitIndex = currentText.lastIndexOf(". ", maxChars);

    // Fallback to maxChars if no safe point found
    if (splitIndex === -1 || splitIndex < maxChars * 0.5) splitIndex = maxChars;
    else splitIndex += 4; // Include the closing tag if found

    chunks.push(currentText.substring(0, splitIndex).trim());
    currentText = currentText.substring(splitIndex).trim();
  }

  return chunks;
};

/**
 * Translates a given text using auto-detection for the source language.
 */
export const translateText = async (
  text: string,
  targetLang: string,
): Promise<string> => {
  if (!text || !targetLang) return text;

  const cacheKey = `${targetLang}:${text}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    // If text is very long, split it (though this is for plain text)
    if (text.length > 3000) {
      const chunks = splitIntoChunks(text, 2500);
      const translatedChunks = await Promise.all(chunks.map(c => translateText(c, targetLang)));
      return translatedChunks.join(' ');
    }

    const url = `${GOOGLE_TRANSLATE_API}${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await axios.get(url, { timeout: 15000 });
    
    if (response.data && response.data[0]) {
      const translated = response.data[0].map((item: any) => item[0]).join('');
      translationCache[cacheKey] = translated;
      return translated;
    }
    
    return text;
  } catch (error) {
    console.error(`[TranslationService] Error translating to ${targetLang}:`, error);
    return text;
  }
};

/**
 * Translates HTML content, ensuring it's chunked for large articles.
 */
export const translateHtml = async (html: string, targetLang: string): Promise<string> => {
  if (!html || !targetLang) return html;

  // Cache check for HTML content (using simple string key)
  const cacheKey = `html:${targetLang}:${html.substring(0, 100)}_${html.length}`;
  if (translationCache[cacheKey]) return translationCache[cacheKey];

  try {
    const chunks = splitIntoChunks(html, 3000);
    const translatedChunks = [];

    // Process chunks sequentially to avoid overwhelming the service
    for (const chunk of chunks) {
      const translated = await translateText(chunk, targetLang);
      translatedChunks.push(translated);
    }

    const result = translatedChunks.join('');
    translationCache[cacheKey] = result;
    return result;
  } catch (error) {
    console.error(`[TranslationService] HTML Translation error:`, error);
    return html;
  }
};

/**
 * Translates an entire article object.
 */
export const translateArticle = async (article: any, targetLang: string, includeContent: boolean = false) => {
  if (!article) return article;

  const tasks = [
    translateText(article.title, targetLang),
    translateText(article.excerpt, targetLang),
    translateText(article.category, targetLang)
  ];

  if (includeContent && article.content) {
    tasks.push(translateHtml(article.content, targetLang));
  }

  const results = await Promise.all(tasks);

  return {
    ...article,
    title: results[0],
    excerpt: results[1],
    category: results[2],
    content: includeContent ? results[3] : article.content,
  };
};

/**
 * Translates a category object.
 */
export const translateCategory = async (category: any, targetLang: string) => {
  if (!category) return category;

  const translatedName = await translateText(category.name, targetLang);

  return {
    ...category,
    name: translatedName,
  };
};
