# UM Managed IT Monitoring LP

Unimedia システム運用・保守サポートのランディングページ実装です。Figma デザイン（`node-id=1-3`）を静的 HTML / CSS / JS で再現しています。

## 起動方法

Node 不要です。日本語テキスト（`llms.txt` など）を正しく表示するため、次のサーバーを使ってください。

```bash
cd /Users/ums/UM-SS
python3 serve.py
```

その後開くページ:

- http://127.0.0.1:5173
- http://127.0.0.1:5173/llms.txt

> `python3 -m http.server` だと `charset=utf-8` が付かないことがあり、ブラウザで日本語が文字化けします。

## 構成

- `index.html` — ページ全体
- `styles.css` — デザイントークンとレイアウト
- `main.js` — FAQ アコーディオン / フォーム補助
- `assets/` — Figma から書き出した画像・SVG
- `middleware.js` — Vercel Basic Auth（無料の username/password 保護）
- `vercel.json` — Vercel 設定

## Vercel で username / password 保護（無料）

Vercel の公式 Password Protection は Pro 課金が必要です。  
このリポジトリは **ログインページ + cookie** で Hobby でも保護できます（スマホでも ID/PASS 入力欄が表示されます）。

1. [vercel.com](https://vercel.com) で `Arnbld17/UM-SS` を Deploy
2. Project → **Settings → Environment Variables** に追加:
   - `BASIC_AUTH_USER` = 共有用ユーザー名（例: `viewer`）
   - `BASIC_AUTH_PASS` = 共有用パスワード
3. **Production / Preview** に付けて Save
4. **Redeploy**（Deployments → 最新 → Redeploy）
5. URL を開くと `/login.html` でユーザー名/パスワード入力画面が出ます

ローカルの `python3 serve.py` には認証はかかりません（環境変数未設定のため）。
