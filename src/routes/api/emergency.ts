import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export const emergencyRouter = new Hono();

// 通知リクエストスキーマ
const notifyRequestSchema = z.object({
  contactId: z.string(),
  message: z.string().max(500),
});

// SOS通知エンドポイント
emergencyRouter.post('/notify', zValidator('json', notifyRequestSchema), async (c) => {
  const { contactId, message } = c.req.valid('json');

  try {
    // 実際の実装では、以下のような処理を行う:
    // 1. データベースから連絡先情報を取得
    // 2. メール送信サービス（SendGrid、Resend等）でメール送信
    // 3. SMS送信サービス（Twilio等）でSMS送信

    // デモ用のレスポンス
    console.log(`[SOS] Contact: ${contactId}, Message: ${message}`);

    // 通知成功をシミュレート
    await new Promise((resolve) => setTimeout(resolve, 500));

    return c.json({
      success: true,
      notifiedAt: new Date().toISOString(),
      contactId,
    });
  } catch (error) {
    console.error('Emergency notification error:', error);

    return c.json(
      {
        success: false,
        error: '通知の送信に失敗しました',
      },
      500
    );
  }
});

// 相談窓口情報エンドポイント
emergencyRouter.get('/helplines', (c) => {
  return c.json({
    helplines: [
      {
        name: 'いのちの電話',
        phone: '0120-783-556',
        hours: '24時間対応（毎月10日）',
        description: '悩みを持つ人々の相談に対応',
        website: 'https://www.inochinodenwa.org/',
      },
      {
        name: 'よりそいホットライン',
        phone: '0120-279-338',
        hours: '24時間対応',
        description: '生活・暮らしの困りごと全般',
        website: 'https://www.since2011.net/yorisoi/',
      },
      {
        name: 'こころの健康相談統一ダイヤル',
        phone: '0570-064-556',
        hours: '都道府県により異なる',
        description: '精神的な悩みの相談窓口',
        website: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/seikatsuhogo/jisatsu/soudan_tel.html',
      },
      {
        name: 'チャイルドライン',
        phone: '0120-99-7777',
        hours: '16:00〜21:00',
        description: '18歳以下の子ども専用相談',
        website: 'https://childline.or.jp/',
      },
      {
        name: 'テルネット',
        phone: '0120-556-155',
        hours: '10:00〜22:00',
        description: '心の悩み相談（Eメール相談も可）',
        website: 'http://telnet-sodan.jp/',
      },
    ],
    emergencyNumbers: [
      {
        name: '警察',
        phone: '110',
        description: '緊急時・犯罪被害',
      },
      {
        name: '救急',
        phone: '119',
        description: '救急車・消防',
      },
    ],
    updatedAt: new Date().toISOString(),
  });
});

// セルフチェックエンドポイント
emergencyRouter.get('/self-check', (c) => {
  return c.json({
    questions: [
      {
        id: 'q1',
        text: '過去2週間、気分が落ち込んだり、憂うつになったり、絶望的な気持ちになったりすることがどのくらいありましたか？',
        options: [
          { value: 0, label: 'まったくない' },
          { value: 1, label: '数日' },
          { value: 2, label: '半分以上' },
          { value: 3, label: 'ほとんど毎日' },
        ],
      },
      {
        id: 'q2',
        text: '物事に対してほとんど興味がない、または楽しめないと感じることがどのくらいありましたか？',
        options: [
          { value: 0, label: 'まったくない' },
          { value: 1, label: '数日' },
          { value: 2, label: '半分以上' },
          { value: 3, label: 'ほとんど毎日' },
        ],
      },
      {
        id: 'q3',
        text: '寝つきが悪い、途中で目が覚める、または逆に眠りすぎることがありましたか？',
        options: [
          { value: 0, label: 'まったくない' },
          { value: 1, label: '数日' },
          { value: 2, label: '半分以上' },
          { value: 3, label: 'ほとんど毎日' },
        ],
      },
      {
        id: 'q4',
        text: '疲れた感じがする、または気力がないと感じることがありましたか？',
        options: [
          { value: 0, label: 'まったくない' },
          { value: 1, label: '数日' },
          { value: 2, label: '半分以上' },
          { value: 3, label: 'ほとんど毎日' },
        ],
      },
    ],
    disclaimer:
      'このセルフチェックは参考情報であり、医療診断ではありません。気になる症状がある場合は、専門家にご相談ください。',
  });
});
