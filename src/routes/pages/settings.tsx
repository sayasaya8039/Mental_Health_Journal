import type { Context } from 'hono';
import { Layout } from '../../components/Layout';

export const SettingsPage = (c: Context) => {
  return c.html(
    <Layout title="設定 - Mental Health Journal" currentPath="/settings">
      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>⚙️ 設定</h2>

      {/* アカウント */}
      <div class="card">
        <h3 class="card-title">👤 アカウント</h3>
        <div id="auth-section">
          <div id="logged-out-view">
            <p class="text-secondary" style={{ marginBottom: 'var(--spacing-md)' }}>
              ログインするとデータをクラウドにバックアップできます
            </p>
            <a href="/login" class="btn btn-primary btn-full">
              ログイン / 新規登録
            </a>
          </div>
          <div id="logged-in-view" style={{ display: 'none' }}>
            <div class="flex items-center gap-md" style={{ marginBottom: 'var(--spacing-md)' }}>
              <img id="user-avatar" src="" alt="" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)' }} />
              <div>
                <div id="user-name" style={{ fontWeight: '600' }}></div>
                <div id="user-email" class="text-secondary" style={{ fontSize: '0.875rem' }}></div>
              </div>
            </div>
            <button id="logout-btn" class="btn btn-secondary btn-full">
              ログアウト
            </button>
          </div>
        </div>
      </div>

      {/* テーマ設定 */}
      <div class="card">
        <h3 class="card-title">🎨 テーマ</h3>
        <div class="setting-group">
          <label class="setting-option">
            <input type="radio" name="theme" value="light" />
            <span>☀️ ライト</span>
          </label>
          <label class="setting-option">
            <input type="radio" name="theme" value="dark" />
            <span>🌙 ダーク</span>
          </label>
          <label class="setting-option">
            <input type="radio" name="theme" value="system" />
            <span>🖥️ システムに合わせる</span>
          </label>
        </div>
      </div>

      {/* AI API設定 */}
      <div class="card">
        <h3 class="card-title">🤖 AI設定</h3>
        <p class="text-secondary" style={{ fontSize: '0.75rem', marginBottom: 'var(--spacing-md)' }}>
          AIアドバイス機能で使用するAPIを設定します。APIキーはローカルに保存され、サーバーには送信されません。
        </p>
        <div class="form-group">
          <label class="form-label">使用するAIモデル</label>
          <select id="ai-provider" class="input">
            <option value="gemini">Google Gemini (gemini-2.0-flash)</option>
            <option value="openai">OpenAI GPT-4.1</option>
            <option value="anthropic">Anthropic Claude Sonnet 4</option>
          </select>
        </div>
        <div class="form-group" id="gemini-key-group">
          <label class="form-label">Gemini API Key</label>
          <input type="password" id="gemini-api-key" class="input" placeholder="AIza..." />
          <p class="text-secondary" style={{ fontSize: '0.75rem', marginTop: 'var(--spacing-xs)' }}>
            <a href="https://aistudio.google.com/apikey" target="_blank" class="text-link">Google AI Studio</a>で取得
          </p>
        </div>
        <div class="form-group" id="openai-key-group" style={{ display: 'none' }}>
          <label class="form-label">OpenAI API Key</label>
          <input type="password" id="openai-api-key" class="input" placeholder="sk-..." />
          <p class="text-secondary" style={{ fontSize: '0.75rem', marginTop: 'var(--spacing-xs)' }}>
            <a href="https://platform.openai.com/api-keys" target="_blank" class="text-link">OpenAI Platform</a>で取得
          </p>
        </div>
        <div class="form-group" id="anthropic-key-group" style={{ display: 'none' }}>
          <label class="form-label">Anthropic API Key</label>
          <input type="password" id="anthropic-api-key" class="input" placeholder="sk-ant-..." />
          <p class="text-secondary" style={{ fontSize: '0.75rem', marginTop: 'var(--spacing-xs)' }}>
            <a href="https://console.anthropic.com/settings/keys" target="_blank" class="text-link">Anthropic Console</a>で取得
          </p>
        </div>
        <button id="save-api-key-btn" class="btn btn-primary btn-full">
          APIキーを保存
        </button>
      </div>

      {/* データ設定 */}
      <div class="card">
        <h3 class="card-title">💾 データ管理</h3>
        <div class="form-group">
          <label class="form-label">データ保存期間</label>
          <select id="data-retention" class="input">
            <option value="30">30日間</option>
            <option value="90">90日間</option>
            <option value="forever">永久に保存</option>
          </select>
        </div>
        <div class="form-group">
          <label class="setting-toggle">
            <input type="checkbox" id="cloud-sync" />
            <span>☁️ クラウド同期を有効にする</span>
          </label>
          <p class="text-secondary" style={{ fontSize: '0.75rem', marginTop: 'var(--spacing-xs)' }}>
            ログイン中のみ利用可能です
          </p>
        </div>
      </div>

      {/* 通知設定 */}
      <div class="card">
        <h3 class="card-title">🔔 リマインダー</h3>
        <div class="form-group">
          <label class="setting-toggle">
            <input type="checkbox" id="reminder-enabled" />
            <span>毎日のリマインダー</span>
          </label>
        </div>
        <div class="form-group" id="reminder-time-group" style={{ display: 'none' }}>
          <label class="form-label">通知時刻</label>
          <input type="time" id="reminder-time" class="input" value="21:00" />
        </div>
      </div>

      {/* 緊急連絡先 */}
      <div class="card">
        <h3 class="card-title">🆘 緊急連絡先</h3>
        <div id="emergency-contacts-list">
          <p class="text-secondary" style={{ padding: 'var(--spacing-sm)' }}>
            登録された連絡先はありません
          </p>
        </div>
        <button id="add-contact-btn" class="btn btn-secondary btn-full" style={{ marginTop: 'var(--spacing-md)' }}>
          ➕ 連絡先を追加
        </button>
      </div>

      {/* プライバシー */}
      <div class="card">
        <h3 class="card-title">🔒 プライバシー</h3>
        <div class="flex flex-col gap-sm">
          <a href="#privacy" class="btn btn-secondary btn-full">
            プライバシーポリシー
          </a>
          <a href="#terms" class="btn btn-secondary btn-full">
            利用規約
          </a>
        </div>
      </div>

      {/* バージョン情報 */}
      <div class="card text-center">
        <p class="text-secondary" style={{ fontSize: '0.875rem' }}>
          Mental Health Journal v1.0.0
        </p>
        <p class="text-secondary" style={{ fontSize: '0.75rem', marginTop: 'var(--spacing-xs)' }}>
          あなたの心を大切に 💙
        </p>
      </div>

      <style>{`
        .setting-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        .setting-option {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background 0.2s;
        }
        .setting-option:hover {
          background: var(--bg-secondary);
        }
        .setting-option input[type="radio"] {
          width: 18px;
          height: 18px;
          accent-color: var(--accent);
        }
        .setting-toggle {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
        }
        .setting-toggle input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: var(--accent);
        }
        .contact-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-sm);
          border-bottom: 1px solid var(--border);
        }
        .contact-item:last-child {
          border-bottom: none;
        }
      `}</style>

      <script>{`
        // ログイン状態の確認
        function checkAuthState() {
          const authUser = JSON.parse(localStorage.getItem('auth_user') || 'null');
          const loggedOutView = document.getElementById('logged-out-view');
          const loggedInView = document.getElementById('logged-in-view');

          if (authUser) {
            loggedOutView.style.display = 'none';
            loggedInView.style.display = 'block';
            document.getElementById('user-name').textContent = authUser.displayName || 'ユーザー';
            document.getElementById('user-email').textContent = authUser.email || '';

            // アバター設定
            const avatar = document.getElementById('user-avatar');
            if (authUser.photoURL) {
              avatar.src = authUser.photoURL;
              avatar.style.display = 'block';
            } else {
              // デフォルトアバター
              avatar.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%237DD3FC"/><text x="50" y="60" text-anchor="middle" font-size="40" fill="white">' + (authUser.displayName ? authUser.displayName.charAt(0).toUpperCase() : '?') + '</text></svg>');
              avatar.style.display = 'block';
            }
          } else {
            loggedOutView.style.display = 'block';
            loggedInView.style.display = 'none';
          }
        }

        // ログアウト処理
        document.getElementById('logout-btn').addEventListener('click', function() {
          if (confirm('ログアウトしますか？')) {
            localStorage.removeItem('auth_user');
            window.location.href = '/login';
          }
        });

        // 設定の読み込み
        function loadSettings() {
          const settings = JSON.parse(localStorage.getItem('user_settings') || '{}');

          // テーマ
          const theme = settings.theme || localStorage.getItem('theme') || 'system';
          document.querySelector('input[name="theme"][value="' + theme + '"]').checked = true;

          // データ保存期間
          document.getElementById('data-retention').value = settings.dataRetention || 'forever';

          // クラウド同期
          document.getElementById('cloud-sync').checked = settings.cloudSyncEnabled || false;

          // リマインダー
          document.getElementById('reminder-enabled').checked = settings.reminderEnabled || false;
          document.getElementById('reminder-time').value = settings.reminderTime || '21:00';
          document.getElementById('reminder-time-group').style.display =
            settings.reminderEnabled ? 'block' : 'none';

          // 緊急連絡先
          loadEmergencyContacts();
        }

        // 設定の保存
        function saveSettings() {
          const theme = document.querySelector('input[name="theme"]:checked').value;
          const settings = {
            theme: theme,
            dataRetention: document.getElementById('data-retention').value,
            cloudSyncEnabled: document.getElementById('cloud-sync').checked,
            reminderEnabled: document.getElementById('reminder-enabled').checked,
            reminderTime: document.getElementById('reminder-time').value
          };
          localStorage.setItem('user_settings', JSON.stringify(settings));

          // テーマ適用
          if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
          } else {
            document.documentElement.dataset.theme = theme;
          }
          localStorage.setItem('theme', theme);
        }

        // 緊急連絡先の読み込み
        function loadEmergencyContacts() {
          const contacts = JSON.parse(localStorage.getItem('emergency_contacts') || '[]');
          const container = document.getElementById('emergency-contacts-list');

          if (contacts.length === 0) {
            container.innerHTML = '<p class="text-secondary" style="padding: var(--spacing-sm)">登録された連絡先はありません</p>';
            return;
          }

          container.innerHTML = contacts.map(contact =>
            '<div class="contact-item">' +
              '<div>' +
                '<div style="font-weight: 500">' + contact.name + '</div>' +
                '<div class="text-secondary" style="font-size: 0.75rem">' + contact.relationship + '</div>' +
              '</div>' +
              '<button class="icon-btn" data-id="' + contact.id + '" onclick="deleteContact(this)">🗑️</button>' +
            '</div>'
          ).join('');
        }

        // 連絡先削除
        window.deleteContact = function(btn) {
          const id = btn.dataset.id;
          let contacts = JSON.parse(localStorage.getItem('emergency_contacts') || '[]');
          contacts = contacts.filter(c => c.id !== id);
          localStorage.setItem('emergency_contacts', JSON.stringify(contacts));
          loadEmergencyContacts();
        };

        // 連絡先追加
        document.getElementById('add-contact-btn').addEventListener('click', function() {
          const name = prompt('連絡先の名前を入力してください：');
          if (!name) return;

          const relationship = prompt('関係性を入力してください（例：家族、友人）：');
          if (!relationship) return;

          const phone = prompt('電話番号を入力してください（任意）：');
          const email = prompt('メールアドレスを入力してください（任意）：');

          const contact = {
            id: crypto.randomUUID(),
            name: name,
            relationship: relationship,
            phone: phone || undefined,
            email: email || undefined,
            notifyOnSOS: true
          };

          const contacts = JSON.parse(localStorage.getItem('emergency_contacts') || '[]');
          contacts.push(contact);
          localStorage.setItem('emergency_contacts', JSON.stringify(contacts));
          loadEmergencyContacts();
        });

        // イベントリスナー
        document.querySelectorAll('input[name="theme"]').forEach(input => {
          input.addEventListener('change', saveSettings);
        });
        document.getElementById('data-retention').addEventListener('change', saveSettings);
        document.getElementById('cloud-sync').addEventListener('change', saveSettings);
        document.getElementById('reminder-enabled').addEventListener('change', function() {
          document.getElementById('reminder-time-group').style.display =
            this.checked ? 'block' : 'none';
          saveSettings();
        });
        document.getElementById('reminder-time').addEventListener('change', saveSettings);

        // AI設定の読み込み
        function loadAISettings() {
          const aiSettings = JSON.parse(localStorage.getItem('ai_settings') || '{}');
          const provider = aiSettings.provider || 'gemini';
          document.getElementById('ai-provider').value = provider;
          updateAIKeyVisibility(provider);

          if (aiSettings.geminiKey) {
            document.getElementById('gemini-api-key').value = aiSettings.geminiKey;
          }
          if (aiSettings.openaiKey) {
            document.getElementById('openai-api-key').value = aiSettings.openaiKey;
          }
          if (aiSettings.anthropicKey) {
            document.getElementById('anthropic-api-key').value = aiSettings.anthropicKey;
          }
        }

        // AIプロバイダー切り替え時のUI更新
        function updateAIKeyVisibility(provider) {
          document.getElementById('gemini-key-group').style.display = provider === 'gemini' ? 'block' : 'none';
          document.getElementById('openai-key-group').style.display = provider === 'openai' ? 'block' : 'none';
          document.getElementById('anthropic-key-group').style.display = provider === 'anthropic' ? 'block' : 'none';
        }

        document.getElementById('ai-provider').addEventListener('change', function() {
          updateAIKeyVisibility(this.value);
        });

        // APIキー保存
        document.getElementById('save-api-key-btn').addEventListener('click', function() {
          const aiSettings = {
            provider: document.getElementById('ai-provider').value,
            geminiKey: document.getElementById('gemini-api-key').value,
            openaiKey: document.getElementById('openai-api-key').value,
            anthropicKey: document.getElementById('anthropic-api-key').value
          };
          localStorage.setItem('ai_settings', JSON.stringify(aiSettings));
          alert('APIキーを保存しました');
        });

        // 初期化
        checkAuthState();
        loadSettings();
        loadAISettings();
      `}</script>
    </Layout>
  );
};
