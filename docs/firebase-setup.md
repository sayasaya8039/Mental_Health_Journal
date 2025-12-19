# Firebase認証設定ガイド

## 必要な認証情報

以下の3つの値が必要です：

- `apiKey` - APIキー
- `authDomain` - 認証ドメイン（例: your-project.firebaseapp.com）
- `projectId` - プロジェクトID

## Firebase Console設定手順

### 1. プロジェクト作成

1. https://console.firebase.google.com にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: mental-health-journal）
4. Google Analyticsは任意で設定
5. 「プロジェクトを作成」をクリック

### 2. Authentication有効化

1. 左メニューの「Authentication」をクリック
2. 「始める」をクリック
3. 「ログイン方法」タブを選択
4. 「Google」を選択して有効化
5. プロジェクトの公開名とサポートメールを設定
6. 「保存」をクリック

### 3. ウェブアプリ登録

1. 左メニューの歯車アイコン → 「プロジェクトの設定」
2. 「マイアプリ」セクションまでスクロール
3. ウェブアイコン `</>` をクリック
4. アプリのニックネームを入力（例: mental-health-journal-web）
5. 「アプリを登録」をクリック

### 4. 認証情報取得

登録後に表示される `firebaseConfig` から以下をコピー：

```javascript
const firebaseConfig = {
  apiKey: "ここの値をコピー",
  authDomain: "ここの値をコピー",
  projectId: "ここの値をコピー",
  // 他の値は不要
};
```

## 設定後に教えてほしい値

1. **apiKey**: AIza... で始まる文字列
2. **authDomain**: xxxxx.firebaseapp.com 形式
3. **projectId**: プロジェクトID文字列

これらの値を教えていただければ、Cloudflare Workersに設定します。

## 補足

- これらの値はクライアントサイドで使用される公開情報です
- APIキーは公開されても問題ない設計になっています
- セキュリティはFirebase Security Rulesで管理します
