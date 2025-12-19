// 気分レベル（1-5）
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

// 気分の絵文字マッピング
export const MOOD_EMOJIS: Record<MoodLevel, string> = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '🙂',
  5: '😊',
};

// 気分のカラーマッピング
export const MOOD_COLORS: Record<MoodLevel, string> = {
  1: '#EF4444', // 赤
  2: '#F97316', // オレンジ
  3: '#EAB308', // 黄
  4: '#22C55E', // 緑
  5: '#3B82F6', // 青
};

// 日記エントリー
export interface JournalEntry {
  id: string;
  date: string; // ISO形式
  moodLevel: MoodLevel;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 緊急連絡先
export interface EmergencyContact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  relationship: string;
  notifyOnSOS: boolean;
}

// 相談窓口
export interface HelplineInfo {
  name: string;
  phone: string;
  hours: string;
  description: string;
}

// ユーザー設定
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  dataRetention: 30 | 90 | 'forever';
  cloudSyncEnabled: boolean;
  reminderEnabled: boolean;
  reminderTime?: string;
}

// AIアドバイスリクエスト
export interface AIAdviceRequest {
  journalEntry: string;
  moodLevel: MoodLevel;
  recentMoods: MoodLevel[];
}

// AIアドバイスレスポンス
export interface AIAdviceResponse {
  advice: string;
  suggestions: string[];
}

// 認証ユーザー
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// テーマ
export type Theme = 'light' | 'dark';

// デフォルトのタグリスト
export const DEFAULT_TAGS = [
  '睡眠',
  '運動',
  '仕事',
  '人間関係',
  '健康',
  '趣味',
  '食事',
  'ストレス',
  'リラックス',
  '達成感',
];

// 日本の相談窓口リスト
export const HELPLINES: HelplineInfo[] = [
  {
    name: 'いのちの電話',
    phone: '0120-783-556',
    hours: '24時間対応（毎月10日）',
    description: '悩みを持つ人々の相談に対応',
  },
  {
    name: 'よりそいホットライン',
    phone: '0120-279-338',
    hours: '24時間対応',
    description: '生活・暮らしの困りごと全般',
  },
  {
    name: 'こころの健康相談統一ダイヤル',
    phone: '0570-064-556',
    hours: '都道府県により異なる',
    description: '精神的な悩みの相談窓口',
  },
  {
    name: 'チャイルドライン',
    phone: '0120-99-7777',
    hours: '16:00〜21:00',
    description: '18歳以下の子ども専用相談',
  },
];
