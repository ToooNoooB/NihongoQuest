
export interface KanjiExample {
  word: string;
  reading: string; // Hiragana reading
  romaji: string;
  meaning: string;
}

export interface ExampleSentence {
  text: string;
  romaji: string;
  translation: string;
  audioReading?: string; // Explicit reading for TTS to avoid errors (e.g. 円 -> Madoka vs En)
}

export interface KanjiData {
  id: string;
  kanji: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  strokes: number;
  sentences: ExampleSentence[];
  mnemonic: string;
  mnemonicImage: string; // URL to visual mnemonic
  jlpt: string;
  set: number;
  examples: KanjiExample[];
}

export interface KanaData {
  id: string;
  character: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  examples: KanjiExample[]; // Reusing standard example structure
  sentences: ExampleSentence[];
}

export interface VocabularyItem {
  id: string;
  word: string; // The word in Kanji/Kana
  reading: string; // Furigana/Reading
  romaji: string;
  meaning: string;
  category: 'Greetings' | 'Verbs' | 'Adjectives' | 'Nouns' | 'Particles' | 'Time' | 'Pronouns' | 'Other';
  usagePoints: string[]; // List of 5-6 detailed pointers
  examples: ExampleSentence[]; // List of at least 5 sentences
}

export interface UserProgress {
  kanjiId: string;
  status: 'new' | 'learning' | 'review' | 'mastered';
  nextReviewDate: number; // Timestamp
  streak: number; // SRS streak
  lastStudied: number; // Timestamp
  accuracy: number; // 0-100
}

export interface UserState {
  id: string;
  isAuthenticated: boolean;
  username: string;
  email: string;
  password?: string; // stored for mock auth
  avatar?: string;
  totalXp: number;
  dailyStreak: number;
  lastLoginDate: string; // ISO Date string
  settings: {
    darkMode: boolean;
  };
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export enum QuizType {
  MEANING_TO_KANJI = 'MEANING_TO_KANJI',
  KANJI_TO_READING = 'KANJI_TO_READING',
  WRITING = 'WRITING'
}
