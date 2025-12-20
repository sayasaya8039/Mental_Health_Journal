import type { Context } from 'hono';
import { html, raw } from 'hono/html';
import { Layout } from '../../components/Layout';

export const LoginPage = (c: Context) => {
  // 環境変数からFirebase設定を取得
  const firebaseApiKey = c.env?.FIREBASE_API_KEY || 'YOUR_API_KEY';
  const firebaseAuthDomain = c.env?.FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN';
  const firebaseProjectId = c.env?.FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID';

  return c.html(
    <Layout title="ログイン - Mental Health Journal" currentPath="/login">
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: 'var(--spacing-xl)' }}>
        {/* ロゴ */}
        <div class="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>💙</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)' }}>Mental Health Journal</h1>
          <p class="text-secondary">あなたの心を大切にするジャーナル</p>
        </div>

        {/* ソーシャルログイン */}
        <div class="card">
          <button id="google-login-btn" class="btn btn-full social-btn google">
            <svg viewBox="0 0 24 24" width="20" height="20" style={{ marginRight: '8px' }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Googleでログイン
          </button>
        </div>

        {/* 区切り線 */}
        <div class="divider">
          <span>または</span>
        </div>

        {/* メール/パスワードログイン */}
        <div class="card">
          <form id="login-form">
            <div class="form-group">
              <label class="form-label" for="email">メールアドレス</label>
              <input type="email" id="email" class="input" placeholder="example@email.com" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="password">パスワード</label>
              <input type="password" id="password" class="input" placeholder="••••••••" required />
            </div>
            <button type="submit" class="btn btn-primary btn-full">
              ログイン
            </button>
          </form>

          <div class="text-center" style={{ marginTop: 'var(--spacing-md)' }}>
            <a href="#forgot" class="text-link">パスワードを忘れた方</a>
          </div>
        </div>

        {/* 新規登録リンク */}
        <div class="card text-center">
          <p class="text-secondary">アカウントをお持ちでない方</p>
          <button id="toggle-register" class="btn btn-secondary btn-full" style={{ marginTop: 'var(--spacing-sm)' }}>
            新規登録
          </button>
        </div>

        {/* 新規登録フォーム（初期非表示） */}
        <div id="register-section" class="card" style={{ display: 'none' }}>
          <h3 class="card-title text-center">新規登録</h3>
          <form id="register-form">
            <div class="form-group">
              <label class="form-label" for="reg-email">メールアドレス</label>
              <input type="email" id="reg-email" class="input" placeholder="example@email.com" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-password">パスワード</label>
              <input type="password" id="reg-password" class="input" placeholder="8文字以上" required minLength={8} />
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-password-confirm">パスワード（確認）</label>
              <input type="password" id="reg-password-confirm" class="input" placeholder="もう一度入力" required />
            </div>
            <button type="submit" class="btn btn-primary btn-full">
              登録する
            </button>
          </form>
          <div class="text-center" style={{ marginTop: 'var(--spacing-md)' }}>
            <button id="back-to-login" class="text-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              ログインに戻る
            </button>
          </div>
        </div>

        {/* プライバシー同意 */}
        <p class="text-center text-secondary" style={{ fontSize: '0.75rem', marginTop: 'var(--spacing-md)' }}>
          ログインすることで、<a href="#terms" class="text-link">利用規約</a>と
          <a href="#privacy" class="text-link">プライバシーポリシー</a>に同意したものとみなされます。
        </p>
      </div>

      {raw(`<style>
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-md);
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-primary);
          font-weight: 500;
        }
        .social-btn:hover {
          background: var(--bg-secondary);
        }
        .divider {
          display: flex;
          align-items: center;
          margin: var(--spacing-lg) 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .divider span {
          padding: 0 var(--spacing-md);
        }
        .text-link {
          color: var(--accent);
          text-decoration: none;
        }
        .text-link:hover {
          text-decoration: underline;
        }
      </style>`)}

      {raw(`<script>
// Firebase設定（環境変数から取得）
const firebaseConfig = {
  apiKey: "${firebaseApiKey}",
  authDomain: "${firebaseAuthDomain}",
  projectId: "${firebaseProjectId}"
};

// Firebase設定が有効かどうかをチェック
const isFirebaseConfigValid = firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.authDomain !== "YOUR_AUTH_DOMAIN" &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID";

// デモモード用ユーザー管理関数
function getDemoUsers() {
  return JSON.parse(localStorage.getItem('demo_users') || '{}');
}

function saveDemoUser(email, password) {
  const users = getDemoUsers();
  users[email] = {
    uid: 'demo-' + Date.now(),
    email: email,
    password: password,
    displayName: email.split('@')[0],
    photoURL: null
  };
  localStorage.setItem('demo_users', JSON.stringify(users));
  return users[email];
}

function findDemoUser(email, password) {
  const users = getDemoUsers();
  const user = users[email];
  if (user && user.password === password) {
    return user;
  }
  return null;
}

function isDemoUserExists(email) {
  const users = getDemoUsers();
  return !!users[email];
}

// Firebase初期化
var firebaseApp = null;
var firebaseAuth = null;

async function initFirebase() {
  if (isFirebaseConfigValid) {
    try {
      var firebaseAppModule = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js');
      var firebaseAuthModule = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js');
      firebaseApp = firebaseAppModule.initializeApp(firebaseConfig);
      firebaseAuth = firebaseAuthModule.getAuth(firebaseApp);
      console.log('Firebase初期化完了');
      return firebaseAuthModule;
    } catch (error) {
      console.error('Firebase初期化エラー:', error);
      return null;
    }
  }
  console.log('デモモードで動作中（Firebase未設定）');
  return null;
}

// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', async function() {
  var authModule = await initFirebase();

  // Googleログイン
  document.getElementById('google-login-btn').addEventListener('click', async function() {
    if (!isFirebaseConfigValid || !firebaseAuth) {
      alert('デモモードではGoogleログインは使用できません。\\nメールアドレスで新規登録してください。');
      return;
    }

    try {
      var provider = new authModule.GoogleAuthProvider();
      var result = await authModule.signInWithPopup(firebaseAuth, provider);
      var user = result.user;

      localStorage.setItem('auth_user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));

      window.location.href = '/';
    } catch (error) {
      console.error('Googleログインエラー:', error);
      alert('ログインに失敗しました: ' + error.message);
    }
  });

  // メール/パスワードログイン
  document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    if (!isFirebaseConfigValid || !firebaseAuth) {
      var user = findDemoUser(email, password);
      if (!user) {
        alert('メールアドレスまたはパスワードが正しくありません。\\nアカウントをお持ちでない場合は新規登録してください。');
        return;
      }
      localStorage.setItem('auth_user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));
      window.location.href = '/';
      return;
    }

    try {
      var result = await authModule.signInWithEmailAndPassword(firebaseAuth, email, password);
      var user = result.user;

      localStorage.setItem('auth_user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));

      window.location.href = '/';
    } catch (error) {
      console.error('ログインエラー:', error);
      alert('ログインに失敗しました: ' + error.message);
    }
  });

  // 新規登録フォームの表示切替
  document.getElementById('toggle-register').addEventListener('click', function() {
    document.getElementById('register-section').style.display = 'block';
    document.getElementById('toggle-register').parentElement.style.display = 'none';
  });

  document.getElementById('back-to-login').addEventListener('click', function() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('toggle-register').parentElement.style.display = 'block';
  });

  // 新規登録
  document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    var email = document.getElementById('reg-email').value;
    var password = document.getElementById('reg-password').value;
    var passwordConfirm = document.getElementById('reg-password-confirm').value;

    if (password !== passwordConfirm) {
      alert('パスワードが一致しません');
      return;
    }

    if (!isFirebaseConfigValid || !firebaseAuth) {
      if (isDemoUserExists(email)) {
        alert('このメールアドレスは既に登録されています。\\nログイン画面からログインしてください。');
        return;
      }
      var user = saveDemoUser(email, password);
      localStorage.setItem('auth_user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));
      alert('登録が完了しました！');
      window.location.href = '/';
      return;
    }

    try {
      var result = await authModule.createUserWithEmailAndPassword(firebaseAuth, email, password);
      var user = result.user;

      localStorage.setItem('auth_user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));

      alert('登録が完了しました！');
      window.location.href = '/';
    } catch (error) {
      console.error('登録エラー:', error);
      alert('登録に失敗しました: ' + error.message);
    }
  });
});
</script>`)}
    </Layout>
  );
};
