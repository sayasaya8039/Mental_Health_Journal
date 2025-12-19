# 設定項目のアカウント紐づけについて

## 現状

**ログインアカウントに紐づけされていません。**

### 現在の保存先

| 設定項目 | 保存先 | キー名 |
|---------|--------|--------|
| ユーザー設定（テーマ等） | localStorage | `user_settings` |
| AI設定（APIキー等） | localStorage | `ai_settings` |
| 緊急連絡先 | localStorage | `emergency_contacts` |
| 日記エントリー | localStorage | `journal_entries` |

## 問題点

1. **デバイス間で共有されない**
   - PCで設定しても、スマホには反映されない

2. **ユーザー間で分離されない**
   - 同じブラウザで別ユーザーがログインしても同じ設定が使われる

3. **ログアウト後も残る**
   - ログアウトしても設定データがブラウザに残ったまま

## 修正方針

### 方針1: ローカル分離のみ（簡易）

localStorageのキーにユーザーIDを含める。

```
settings_${userId}
ai_settings_${userId}
emergency_contacts_${userId}
journal_entries_${userId}
```

**メリット:**
- 実装が簡単
- サーバー側の変更不要

**デメリット:**
- デバイス間の同期はできない

### 方針2: クラウド同期（推奨）

Firebase Firestoreにユーザーごとの設定を保存。

```
/users/${userId}/settings
/users/${userId}/ai_settings
/users/${userId}/emergency_contacts
/users/${userId}/journal_entries
```

**メリット:**
- デバイス間で完全同期
- バックアップになる

**デメリット:**
- Firestoreの設定が必要
- APIキーなど機密情報の暗号化が必要

## どちらを実装しますか？

1. **方針1（ローカル分離のみ）** - すぐに実装可能
2. **方針2（クラウド同期）** - Firebase Firestoreの追加設定が必要
