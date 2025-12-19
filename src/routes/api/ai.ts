import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

type Bindings = {
  GEMINI_API_KEY: string;
};

export const aiRouter = new Hono<{ Bindings: Bindings }>();

// リクエストスキーマ
const adviceRequestSchema = z.object({
  journalEntry: z.string().min(1).max(5000),
  moodLevel: z.number().int().min(1).max(5),
  recentMoods: z.array(z.number().int().min(1).max(5)).optional().default([]),
});

// AIアドバイスエンドポイント
aiRouter.post('/advice', zValidator('json', adviceRequestSchema), async (c) => {
  const { journalEntry, moodLevel, recentMoods } = c.req.valid('json');
  const apiKey = c.env.GEMINI_API_KEY;

  // APIキーが設定されていない場合はデモレスポンス
  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    return c.json({
      advice: getDefaultAdvice(moodLevel),
      suggestions: getDefaultSuggestions(moodLevel),
    });
  }

  try {
    // Gemini API呼び出し
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: buildPrompt(journalEntry, moodLevel, recentMoods),
                },
              ],
            },
          ],
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // レスポンスをパース
    const { advice, suggestions } = parseGeminiResponse(text, moodLevel);

    return c.json({ advice, suggestions });
  } catch (error) {
    console.error('AI advice error:', error);

    // エラー時はデフォルトのアドバイスを返す
    return c.json({
      advice: getDefaultAdvice(moodLevel),
      suggestions: getDefaultSuggestions(moodLevel),
    });
  }
});

// プロンプト構築
function buildPrompt(journalEntry: string, moodLevel: number, recentMoods: number[]): string {
  const moodDescription = getMoodDescription(moodLevel);
  const trendDescription = getTrendDescription(recentMoods);

  return `あなたは心理カウンセラーのアシスタントです。ユーザーの日記と気分に基づいて、温かく寄り添うアドバイスを提供してください。

【重要な注意事項】
- あなたは医療専門家ではありません。医療アドバイスは行わないでください。
- 深刻な症状（自傷行為、希死念慮など）が見られる場合は、専門家への相談を勧めてください。
- 共感的で温かいトーンを心がけてください。
- 具体的で実行可能なアドバイスを提供してください。

【ユーザーの状況】
今日の気分: ${moodLevel}/5（${moodDescription}）
${trendDescription ? `気分の傾向: ${trendDescription}` : ''}

【日記の内容】
${journalEntry}

【回答形式】
以下のJSON形式で回答してください：
{
  "advice": "メインのアドバイス（200文字程度）",
  "suggestions": ["提案1", "提案2", "提案3"]
}

提案は具体的で今すぐ実行できるものを3つ挙げてください。`;
}

// 気分の説明を取得
function getMoodDescription(moodLevel: number): string {
  const descriptions: Record<number, string> = {
    1: 'とても辛い・落ち込んでいる',
    2: '少し辛い・憂鬱',
    3: '普通・平穏',
    4: '良い・前向き',
    5: 'とても良い・幸せ',
  };
  return descriptions[moodLevel] || '普通';
}

// 気分の傾向を取得
function getTrendDescription(recentMoods: number[]): string {
  if (recentMoods.length < 2) return '';

  const avg = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
  const latest = recentMoods[recentMoods.length - 1];

  if (latest > avg + 0.5) {
    return '改善傾向';
  } else if (latest < avg - 0.5) {
    return '低下傾向';
  }
  return '安定';
}

// Geminiレスポンスをパース
function parseGeminiResponse(
  text: string,
  moodLevel: number
): { advice: string; suggestions: string[] } {
  try {
    // JSONを抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        advice: parsed.advice || getDefaultAdvice(moodLevel),
        suggestions: parsed.suggestions || getDefaultSuggestions(moodLevel),
      };
    }
  } catch {
    // パース失敗時
  }

  // パースできない場合はテキストをそのままアドバイスとして使用
  return {
    advice: text.substring(0, 300) || getDefaultAdvice(moodLevel),
    suggestions: getDefaultSuggestions(moodLevel),
  };
}

// デフォルトのアドバイス
function getDefaultAdvice(moodLevel: number): string {
  const advices: Record<number, string> = {
    1: '今日は辛い一日だったのですね。そんな日もあります。無理をせず、自分を責めないでください。小さなことでも、今日できたことを認めてあげてくださいね。',
    2: '少し気持ちが沈んでいるようですね。そんな時は、好きなことを少しだけしてみるのはいかがでしょうか。完璧でなくても大丈夫です。',
    3: '穏やかな一日を過ごせているようですね。この平穏を大切にしながら、少しだけ自分を労ってあげてください。',
    4: '良い一日だったようで嬉しいです！この気持ちを覚えておいて、辛い時に思い出してくださいね。',
    5: 'とても素敵な一日だったのですね！この幸せな気持ちを味わってください。周りの人にも良い影響を与えているかもしれませんよ。',
  };
  return advices[moodLevel] || advices[3];
}

// デフォルトの提案
function getDefaultSuggestions(moodLevel: number): string[] {
  if (moodLevel <= 2) {
    return [
      '温かい飲み物を飲んでリラックスする',
      '短い散歩で気分転換する',
      '信頼できる人に話を聞いてもらう',
    ];
  } else if (moodLevel <= 3) {
    return [
      '好きな音楽を聴く',
      '軽いストレッチをする',
      '今日の良かったことを3つ書き出す',
    ];
  } else {
    return [
      'この気持ちを日記に詳しく書き留める',
      '誰かに感謝の気持ちを伝える',
      '新しいことに挑戦してみる',
    ];
  }
}
