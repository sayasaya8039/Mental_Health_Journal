// Firebase設定（実際の値は環境変数から取得）
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID"
};

// Firebase設定が有効かどうかをチェック
const isFirebaseConfigValid = firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.authDomain !== "YOUR_AUTH_DOMAIN" &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID";

// Firebase初期化（設定が有効な場合のみ）
let auth = null;

async function initFirebase() {
  if (isFirebaseConfigValid) {
    try {
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js');
      const { getAuth } = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js');
      const app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      console.log('Firebase初期化完了');
    } catch (error) {
      console.log('Firebase初期化エラー:', error);
      auth = null;
    }
  } else {
    console.log('デモモードで動作中（Firebase未設定）');
    auth = null;
  }
}

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

// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', async () => {
  await initFirebase();

  // Googleログイン
  document.getElementById('google-login-btn').addEventListener('click', async () => {
    if (!auth) {
      // デモモード：Googleログインは使えない
      alert('デモモードではGoogleログインは使用できません。\nメールアドレスで新規登録してください。');
      return;
    }

    try {
      const { signInWithPopup, GoogleAuthProvider } = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

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
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!auth) {
      // デモモード：登録済みユーザーを確認
      const user = findDemoUser(email, password);
      if (!user) {
        alert('メールアドレスまたはパスワードが正しくありません。\nアカウントをお持ちでない場合は新規登録してください。');
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
      const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js');
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

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
  document.getElementById('toggle-register').addEventListener('click', () => {
    document.getElementById('register-section').style.display = 'block';
    document.getElementById('toggle-register').parentElement.style.display = 'none';
  });

  document.getElementById('back-to-login').addEventListener('click', () => {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('toggle-register').parentElement.style.display = 'block';
  });

  // 新規登録
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;

    if (password !== passwordConfirm) {
      alert('パスワードが一致しません');
      return;
    }

    if (!auth) {
      // デモモード：既存ユーザーチェック
      if (isDemoUserExists(email)) {
        alert('このメールアドレスは既に登録されています。\nログイン画面からログインしてください。');
        return;
      }
      // 新規ユーザーを保存
      const user = saveDemoUser(email, password);
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
      const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

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
