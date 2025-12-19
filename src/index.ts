import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/cloudflare-workers';

// ページ
import { HomePage } from './routes/pages/index';
import { JournalPage } from './routes/pages/journal';
import { HistoryPage } from './routes/pages/history';
import { SettingsPage } from './routes/pages/settings';
import { EmergencyPage } from './routes/pages/emergency';
import { LoginPage } from './routes/pages/login';

// API
import { aiRouter } from './routes/api/ai';
import { emergencyRouter } from './routes/api/emergency';

// 環境変数の型定義
type Bindings = {
  GEMINI_API_KEY: string;
  OPENAI_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// ミドルウェア
app.use('*', logger());
app.use('*', cors());

// 静的ファイル配信
app.use('/js/*', serveStatic({ root: './' }));
app.use('/css/*', serveStatic({ root: './' }));
app.use('/icons/*', serveStatic({ root: './' }));
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }));
app.use('/manifest.json', serveStatic({ path: './manifest.json' }));

// API ルート
app.route('/api/ai', aiRouter);
app.route('/api/emergency', emergencyRouter);

// ページルート
app.get('/', HomePage);
app.get('/journal', JournalPage);
app.get('/history', HistoryPage);
app.get('/settings', SettingsPage);
app.get('/emergency', EmergencyPage);
app.get('/login', LoginPage);

// ヘルスチェック
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

export default app;
