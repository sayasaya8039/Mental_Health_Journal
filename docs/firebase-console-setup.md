# Firebase Console 追加設定

## 現在の設定状況

Cloudflare Workersには以下が設定済みです：

- apiKey: `AIzaSyCkxxm0ffdvxu3xh1iHvMql8YBU3syjlXc`
- authDomain: `mental-health-journal-8fdce.firebaseapp.com`
- projectId: `mental-health-journal-8fdce`

## Firebase Consoleで必要な設定

### 1. Google認証を有効化

1. Firebase Console (https://console.firebase.google.com) にアクセス
2. プロジェクト「mental-health-journal-8fdce」を選択
3. 左メニュー「Authentication」をクリック
4. 「Sign-in method」タブを選択
5. 「Google」をクリック
6. 右上のトグルを「有効」にする
7. 「プロジェクトの公開名」を入力（例: Mental Health Journal）
8. 「サポートメール」を選択
9. 「保存」をクリック

### 2. 承認済みドメインを追加

1. 「Authentication」→「Settings」タブを選択
2. 「承認済みドメイン」セクションを探す
3. 「ドメインを追加」をクリック
4. 以下のドメインを追加：

```
mental-health-journal.sayasaya.workers.dev
```

5. 「追加」をクリック

## 確認方法

設定完了後、以下のURLでGoogleログインをテスト：

https://mental-health-journal.sayasaya.workers.dev/login

「Googleでログイン」ボタンをクリックして、Googleアカウント選択画面が表示されれば成功です。

## トラブルシューティング

### エラー: "auth/unauthorized-domain"
→ 承認済みドメインに `mental-health-journal.sayasaya.workers.dev` が追加されていない

### エラー: "auth/operation-not-allowed"
→ Google認証が有効化されていない

### ポップアップがブロックされる
→ ブラウザのポップアップブロッカーを確認
