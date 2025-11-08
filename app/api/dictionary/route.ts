import { NextResponse } from 'next/server';
import wordListPath from 'word-list';
import { readFile } from 'fs/promises';

let dictionaryWords: string[] | null = null;

export async function GET() {
  try {
    if (!dictionaryWords) {
      const content = await readFile(wordListPath, 'utf-8');
      dictionaryWords = content
        .split('\n')
        .filter((word) => word.trim().length > 0)
        .map((word) => word.toLowerCase());
    }

    return NextResponse.json({ words: dictionaryWords });
  } catch (error) {
    console.error('Failed to load dictionary:', error);
    return NextResponse.json({ error: 'Failed to load dictionary' }, { status: 500 });
  }
}
