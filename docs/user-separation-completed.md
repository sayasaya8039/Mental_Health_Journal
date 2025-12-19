# ユーザー間設定分離 - 完了

## 実装内容

localStorageのキーにユーザーIDを含めて、ユーザー間でデータを分離しました。

### 変更前

```
localStorage.getItem('user_settings')
localStorage.getItem('ai_settings')
localStorage.getItem('emergency_contacts')
localStorage.getItem('journal_entries')
```

### 変更後

```
localStorage.getItem('user_settings_' + userId)
localStorage.getItem('ai_settings_' + userId)
localStorage.getItem('emergency_contacts_' + userId)
localStorage.getItem('journal_entries_' + userId)
```

## ユーザーIDの取得方法

```javascript
function getUserId() {
  const authUser = JSON.parse(localStorage.getItem('auth_user') || 'null');
  return authUser?.uid || 'guest';
}
```

- ログイン中: FirebaseのユーザーUID
- 未ログイン: `'guest'`

## 修正したファイル

| ファイル | 修正内容 |
|---------|---------|
| settings.tsx | user_settings, ai_settings, emergency_contacts |
| journal.tsx | journal_entries, ai_settings |
| history.tsx | journal_entries |
| emergency.tsx | emergency_contacts |

## 動作

1. **ユーザーAがログイン** → `user_settings_abc123` に保存
2. **ユーザーBがログイン** → `user_settings_xyz789` に保存
3. **未ログイン** → `user_settings_guest` に保存

これにより、同じブラウザでも異なるユーザーが別々の設定を持てるようになりました。

## デプロイ済み

https://mental-health-journal.sayasaya.workers.dev
