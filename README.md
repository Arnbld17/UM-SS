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
