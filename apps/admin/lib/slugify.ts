import { pinyin } from 'pinyin-pro';

/**
 * Generate URL-safe slug from text (supports Chinese)
 * Example: "Steam 充值卡 100元" -> "steam-chong-zhi-ka-100-yuan"
 */
export function generateSlug(text: string): string {
  if (!text) return '';

  // Convert Chinese to pinyin
  const pinyinText = pinyin(text, { toneType: 'none', type: 'array' }).join('-');

  // Process: lowercase, remove special chars, spaces to hyphens, deduplicate hyphens
  return pinyinText
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
}

/**
 * Validate slug format
 */
export function validateSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}
