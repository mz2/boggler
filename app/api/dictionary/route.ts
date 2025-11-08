import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

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
      // Read the word file directly
      const wordFilePath = join(
        process.cwd(),
        'node_modules/most-common-words-by-language/build/resources',
        `${language}.txt`
      );
      const content = await readFile(wordFilePath, 'utf-8');

      // Parse and filter words
      const words = content
        .split('\n')
        .map((line) => line.trim())
        .filter((word) => word.length >= 4 && word.length <= 9)
        .map((word) => word.toLowerCase())
        .slice(0, 10000); // Take first 10,000 words

      dictionaryCache.set(language, words);
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
