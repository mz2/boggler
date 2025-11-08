import { NextResponse } from 'next/server';
import { getWordsList } from 'most-common-words-by-language';

// Cache dictionaries by language
const dictionaryCache = new Map<string, string[]>();

// Supported languages
const SUPPORTED_LANGUAGES = ['english', 'finnish'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'english';

    // Validate language
    if (!SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}. Supported: ${SUPPORTED_LANGUAGES.join(', ')}` },
        { status: 400 }
      );
    }

    // Check cache
    if (!dictionaryCache.has(language)) {
      // Get 10,000 most common words for this language
      const words = getWordsList(language, 10000);

      // Filter to 4-9 letters and convert to lowercase
      const filteredWords = words
        .filter((word) => word.length >= 4 && word.length <= 9)
        .map((word) => word.toLowerCase());

      dictionaryCache.set(language, filteredWords);
    }

    return NextResponse.json({
      words: dictionaryCache.get(language),
      language
    });
  } catch (error) {
    console.error('Failed to load dictionary:', error);
    return NextResponse.json({ error: 'Failed to load dictionary' }, { status: 500 });
  }
}
