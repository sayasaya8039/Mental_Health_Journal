# Mental Health Journal

あなたの心を大切にするオンラインメンタルヘルスジャーナルです。

## 機能

- **気分ログ**: 5段階の絵文字で今の気分を記録
- **日記機能**: 思ったこと、感じたことを自由に書き留める
- **AIアドバイス**: Google Geminiによるパーソナライズドなアドバイス
- **統計表示**: 気分の推移をグラフで可視化
- **緊急連絡**: 相談窓口リスト表示と登録連絡先への通知
- **プライバシー重視**: ローカルファーストでデータを保存

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | Hono + TypeScript |
| ホスティング | Cloudflare Workers |
| 認証 | Firebase Authentication |
| データベース | IndexedDB (ローカル) + Firestore (オプション) |
| AI | Google Gemini API |

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
# Gemini API Key
wrangler secret put GEMINI_API_KEY

# Firebase設定（オプション）
wrangler secret put FIREBASE_API_KEY
wrangler secret put FIREBASE_AUTH_DOMAIN
wrangler secret put FIREBASE_PROJECT_ID
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:8787 を開きます。

### 4. デプロイ

```bash
npm run deploy
```

## 使い方

1. **気分を記録**: ホーム画面で今の気分を選択
2. **日記を書く**: 思ったことを自由に書き留める
3. **AIアドバイス**: 日記を書いた後、AIにアドバイスをもらう
4. **履歴を確認**: 過去の気分の推移をグラフで確認
5. **緊急連絡**: つらい時は相談窓口に連絡

## 相談窓口

つらい時は一人で抱え込まないでください。

- **いのちの電話**: 0120-783-556
- **よりそいホットライン**: 0120-279-338
- **こころの健康相談統一ダイヤル**: 0570-064-556

## プライバシー

- データは基本的にブラウザのIndexedDBに保存されます
- クラウド同期は任意で有効化できます
- データのエクスポート・削除機能があります

## ライセンス

MIT License

---

v1.0.0 | Made with 💙 for mental health
