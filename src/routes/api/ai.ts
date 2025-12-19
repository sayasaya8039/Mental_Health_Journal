import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

// 環境変数の型定義
type Bindings = {
  GEMINI_API_KEY: string;
  OPENAI_API_KEY: string;
  ANTHROPIC_API_KEY: string;
};

// AIプロバイダーの型
type AIProvider = 'gemini' | 'openai' | 'claude';

export const aiRouter = new Hono<{ Bindings: Bindings }>();

// リクエストスキーマ
const adviceRequestSchema = z.object({
  journalEntry: z.string().min(1).max(5000),
  moodLevel: z.number().int().min(1).max(5),
  recentMoods: z.array(z.number().int().min(1).max(5)).optional().default([]),
  provider: z.enum(['gemini', 'openai', 'claude']).optional().default('gemini'),
});

// AIアドバイスエンドポイント
aiRouter.post('/advice', zValidator('json', adviceRequestSchema), async (c) => {
  const { journalEntry, moodLevel, recentMoods, provider } = c.req.valid('json');

  const prompt = buildPrompt(journalEntry, moodLevel, recentMoods);

  try {
    let response: { advice: string; suggestions: string[] };

    switch (provider) {
      case 'openai':
        response = await callOpenAI(c.env.OPENAI_API_KEY, prompt, moodLevel);
        break;
      case 'claude':
        response = await callClaude(c.env.ANTHROPIC_API_KEY, prompt, moodLevel);
        break;
      case 'gemini':
      default:
        response = await callGemini(c.env.GEMINI_API_KEY, prompt, moodLevel);
        break;
    }

    return c.json({ ...response, provider });
  } catch (error) {
    console.error(`AI advice error (${provider}):`, error);

    // エラー時はデフォルトのアドバイスを返す
    return c.json({
      advice: getDefaultAdvice(moodLevel),
      suggestions: getDefaultSuggestions(moodLevel),
      provider: 'default',
    });
  }
});

// 利用可能なプロバイダー一覧
aiRouter.get('/providers', (c) => {
  const providers = [
    {
      id: 'gemini',
      name: 'Gemini 3 Flash',
      model: 'gemini-3.0-flash',
      available: !!c.env.GEMINI_API_KEY,
    },
    {
      id: 'openai',
      name: 'GPT-5.2',
      model: 'gpt-5.2',
      available: !!c.env.OPENAI_API_KEY,
    },
    {
      id: 'claude',
      name: 'Claude Haiku 4.5',
      model: 'claude-haiku-4-5-20251212',
      available: !!c.env.ANTHROPIC_API_KEY,
    },
  ];

  return c.json({ providers });
});

// ========================================
// Gemini API
// ========================================
async function callGemini(
  apiKey: string,
  prompt: string,
  moodLevel: number
): Promise<{ advice: string; suggestions: string[] }> {
  if (!apiKey) {
    return {
      advice: getDefaultAdvice(moodLevel),
      suggestions: getDefaultSuggestions(moodLevel),
    };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return parseAIResponse(text, moodLevel);
}

// ========================================
// OpenAI API (GPT-5.2)
// ========================================
async function callOpenAI(
  apiKey: string,
  prompt: string,
  moodLevel: number
): Promise<{ advice: string; suggestions: string[] }> {
  if (!apiKey) {
    return {
      advice: getDefaultAdvice(moodLevel),
      suggestions: getDefaultSuggestions(moodLevel),
    };
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-5.2',
      messages: [
        {
          role: 'system',
          content:
            'あなたは心理カウンセラーのアシスタントです。温かく寄り添うアドバイスを提供してください。医療アドバイスは行わないでください。',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content || '';

  return parseAIResponse(text, moodLevel);
}

// ========================================
// Claude API (Haiku 4.5)
// ========================================
async function callClaude(
  apiKey: string,
  prompt: string,
  moodLevel: number
): Promise<{ advice: string; suggestions: string[] }> {
  if (!apiKey) {
    return {
      advice: getDefaultAdvice(moodLevel),
      suggestions: getDefaultSuggestions(moodLevel),
    };
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251212',
      max_tokens: 1024,
      system:
        'あなたは心理カウンセラーのアシスタントです。温かく寄り添うアドバイスを提供してください。医療アドバイスは行わないでください。深刻な症状が見られる場合は、専門家への相談を勧めてください。',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = data.content?.find((c) => c.type === 'text')?.text || '';

  return parseAIResponse(text, moodLevel);
}

// ========================================
// 共通関数
// ========================================

// プロンプト構築
function buildPrompt(journalEntry: string, moodLevel: number, recentMoods: number[]): string {
  const moodDescription = getMoodDescription(moodLevel);
  const trendDescription = getTrendDescription(recentMoods);

  return `ユーザーの日記と気分に基づいて、温かく寄り添うアドバイスを提供してください。

【重要な注意事項】
- 医療アドバイスは行わないでください。
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

  if (latest > avg + 0.5) return '改善傾向';
  if (latest < avg - 0.5) return '低下傾向';
  return '安定';
}

// AIレスポンスをパース
function parseAIResponse(
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
    return ['好きな音楽を聴く', '軽いストレッチをする', '今日の良かったことを3つ書き出す'];
  } else {
    return [
      'この気持ちを日記に詳しく書き留める',
      '誰かに感謝の気持ちを伝える',
      '新しいことに挑戦してみる',
    ];
  }
}
