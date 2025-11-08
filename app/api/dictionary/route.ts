import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Separate caches for seeding (common words) and validation (comprehensive)
const seedingCache = new Map<string, string[]>();
const validationCache = new Map<string, Set<string>>();

// Supported languages
const SUPPORTED_LANGUAGES = ['english', 'finnish'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

/**
 * Load seeding dictionary (common words for grid generation)
 */
async function loadSeedingDictionary(language: string): Promise<string[]> {
  if (seedingCache.has(language)) {
    return seedingCache.get(language)!;
  }

  // Read from most-common-words-by-language (curated common words)
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
    .slice(0, 5000); // Take first 5,000 common words for seeding

  seedingCache.set(language, words);
  return words;
}

/**
 * Load validation dictionary (comprehensive word list)
 */
async function loadValidationDictionary(language: string): Promise<Set<string>> {
  if (validationCache.has(language)) {
    return validationCache.get(language)!;
  }

  let wordFilePath: string;

  if (language === 'english') {
    // Use word-list package for comprehensive English dictionary
    wordFilePath = join(process.cwd(), 'node_modules/word-list/words.txt');
  } else if (language === 'finnish') {
    // Use comprehensive Finnish dictionary (93,086 words from Kotus)
    wordFilePath = join(process.cwd(), 'dictionaries/finnish.txt');
  } else {
    throw new Error(`Unsupported language: ${language}`);
  }

  const content = await readFile(wordFilePath, 'utf-8');

  // Parse and create Set for fast validation
  const wordSet = new Set(
    content
      .split('\n')
      .map((line) => line.trim().toLowerCase())
      .filter((word) => word.length >= 3) // Accept 3+ letter words for validation
  );

  validationCache.set(language, wordSet);
  return wordSet;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'english';
    const type = searchParams.get('type') || 'both'; // 'seeding', 'validation', or 'both'

    // Validate language
    if (!SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}. Supported: ${SUPPORTED_LANGUAGES.join(', ')}` },
        { status: 400 }
      );
    }

    const response: {
      seedingWords?: string[];
      validationWords?: string[];
      language: string;
      seedingCount?: number;
      validationCount?: number;
    } = { language };

    // Load seeding dictionary if requested
    if (type === 'seeding' || type === 'both') {
      const seedingWords = await loadSeedingDictionary(language);
      response.seedingWords = seedingWords;
      response.seedingCount = seedingWords.length;
    }

    // Load validation dictionary if requested
    if (type === 'validation' || type === 'both') {
      const validationSet = await loadValidationDictionary(language);
      response.validationWords = Array.from(validationSet);
      response.validationCount = validationSet.size;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to load dictionary:', error);
    return NextResponse.json({ error: 'Failed to load dictionary' }, { status: 500 });
  }
}
