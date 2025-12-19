import type { FC, PropsWithChildren } from 'hono/jsx';

interface LayoutProps extends PropsWithChildren {
  title?: string;
  currentPath?: string;
}

const navItems = [
  { path: '/', label: 'ホーム', icon: '🏠' },
  { path: '/journal', label: '日記', icon: '📝' },
  { path: '/history', label: '履歴', icon: '📊' },
  { path: '/emergency', label: '緊急', icon: '🆘' },
  { path: '/settings', label: '設定', icon: '⚙️' },
];

export const Layout: FC<LayoutProps> = ({ children, title = 'Mental Health Journal', currentPath = '/' }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="あなたの心を大切にするメンタルヘルスジャーナル" />
        <meta name="theme-color" content="#0F172A" />
        <title>{title}</title>
        <link rel="manifest" href="/manifest.json" />
        <style>{globalStyles}</style>
      </head>
      <body>
        <div id="app" class="app-container">
          {/* ヘッダー */}
          <header class="header">
            <div class="header-content">
              <h1 class="logo">
                <span class="logo-icon">💙</span>
                <span class="logo-text">Mental Health Journal</span>
              </h1>
              <div class="header-actions">
                <button id="theme-toggle" class="icon-btn" aria-label="テーマ切替">
                  <span class="theme-icon-light">☀️</span>
                  <span class="theme-icon-dark">🌙</span>
                </button>
                <button id="user-menu" class="icon-btn" aria-label="ユーザーメニュー">
                  👤
                </button>
              </div>
            </div>
          </header>

          {/* メインコンテンツ */}
          <main class="main-content">
            {children}
          </main>

          {/* ナビゲーション */}
          <nav class="bottom-nav">
            {navItems.map((item) => (
              <a
                href={item.path}
                class={`nav-item ${currentPath === item.path ? 'active' : ''}`}
              >
                <span class="nav-icon">{item.icon}</span>
                <span class="nav-label">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* SOS ボタン（常時表示） */}
          <a href="/emergency" class="sos-fab" aria-label="緊急連絡">
            SOS
          </a>
        </div>

        {/* テーマ・認証スクリプト */}
        <script>{clientScript}</script>
      </body>
    </html>
  );
};

// グローバルスタイル
const globalStyles = `
  :root {
    /* ライトモード */
    --bg-primary: #F0F9FF;
    --bg-secondary: #E0F2FE;
    --bg-card: #FFFFFF;
    --text-primary: #334155;
    --text-secondary: #64748B;
    --accent: #7DD3FC;
    --accent-hover: #38BDF8;
    --success: #A7F3D0;
    --error: #FECACA;
    --warning: #FDE68A;
    --border: #CBD5E1;

    /* スペーシング */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;

    /* 角丸 */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-full: 9999px;

    /* シャドウ */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  [data-theme="dark"] {
    --bg-primary: #0F172A;
    --bg-secondary: #1E293B;
    --bg-card: #1E293B;
    --text-primary: #E0F2FE;
    --text-secondary: #94A3B8;
    --accent: #38BDF8;
    --accent-hover: #7DD3FC;
    --success: #34D399;
    --error: #F87171;
    --warning: #FBBF24;
    --border: #334155;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Hiragino Sans', sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    min-height: 100vh;
    height: 100%;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 480px;
    margin: 0 auto;
    background: var(--bg-primary);
  }

  /* ヘッダー */
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    padding: var(--spacing-md);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 1.2rem;
    font-weight: 600;
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .header-actions {
    display: flex;
    gap: var(--spacing-sm);
  }

  .icon-btn {
    background: transparent;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: var(--radius-full);
    transition: background 0.2s;
  }

  .icon-btn:hover {
    background: var(--bg-card);
  }

  /* テーマアイコン表示制御 */
  .theme-icon-dark { display: none; }
  [data-theme="dark"] .theme-icon-light { display: none; }
  [data-theme="dark"] .theme-icon-dark { display: inline; }

  /* メインコンテンツ */
  .main-content {
    flex: 1;
    padding: var(--spacing-md);
    padding-bottom: 80px;
  }

  /* ボトムナビ */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    display: flex;
    justify-content: space-around;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border);
    padding: var(--spacing-sm) 0;
    z-index: 100;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: var(--text-secondary);
    font-size: 0.75rem;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-md);
    transition: color 0.2s;
  }

  .nav-item.active {
    color: var(--accent);
  }

  .nav-item:hover {
    color: var(--accent-hover);
  }

  .nav-icon {
    font-size: 1.25rem;
    margin-bottom: 2px;
  }

  /* SOSボタン */
  .sos-fab {
    position: fixed;
    right: 16px;
    bottom: 80px;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #EF4444, #DC2626);
    color: white;
    font-weight: bold;
    font-size: 0.875rem;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    box-shadow: var(--shadow-lg);
    z-index: 90;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  /* カード */
  .card {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
  }

  .card-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
  }

  /* ボタン */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    text-decoration: none;
  }

  .btn-primary {
    background: var(--accent);
    color: var(--bg-primary);
  }

  .btn-primary:hover {
    background: var(--accent-hover);
  }

  .btn-secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border);
  }

  .btn-secondary:hover {
    background: var(--bg-card);
  }

  .btn-full {
    width: 100%;
  }

  /* 入力フォーム */
  .input, .textarea {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    background: var(--bg-card);
    color: var(--text-primary);
    transition: border-color 0.2s;
  }

  .input:focus, .textarea:focus {
    outline: none;
    border-color: var(--accent);
  }

  .textarea {
    min-height: 120px;
    resize: vertical;
  }

  .form-group {
    margin-bottom: var(--spacing-md);
  }

  .form-label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-weight: 500;
  }

  /* 気分選択 */
  .mood-selector {
    display: flex;
    justify-content: space-around;
    padding: var(--spacing-md) 0;
  }

  .mood-btn {
    font-size: 2rem;
    background: transparent;
    border: 3px solid transparent;
    border-radius: var(--radius-full);
    padding: var(--spacing-sm);
    cursor: pointer;
    transition: all 0.2s;
    opacity: 0.5;
  }

  .mood-btn:hover {
    opacity: 0.8;
    transform: scale(1.1);
  }

  .mood-btn.selected {
    opacity: 1;
    border-color: var(--accent);
    transform: scale(1.2);
  }

  /* ユーティリティ */
  .text-center { text-align: center; }
  .text-secondary { color: var(--text-secondary); }
  .mt-md { margin-top: var(--spacing-md); }
  .mb-md { margin-bottom: var(--spacing-md); }
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .gap-sm { gap: var(--spacing-sm); }
  .gap-md { gap: var(--spacing-md); }
`;

// クライアントサイドスクリプト
const clientScript = `
  // テーマ管理
  (function() {
    const getTheme = () => localStorage.getItem('theme') || 'system';
    const setTheme = (theme) => {
      if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
      } else {
        document.documentElement.dataset.theme = theme;
      }
      localStorage.setItem('theme', theme);
    };

    // 初期化
    setTheme(getTheme());

    // テーマ切替ボタン
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme;
      setTheme(current === 'dark' ? 'light' : 'dark');
    });

    // システムテーマ変更を監視
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (getTheme() === 'system') setTheme('system');
    });
  })();
`;
