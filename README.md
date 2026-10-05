# UM Managed IT Monitoring LP

Unimedia システム運用・保守サポートのランディングページ実装です。Figma デザイン（`node-id=1-3`）を静的 HTML / CSS / JS で再現しています。

## 起動方法

Node 不要です。プロジェクト直下の `index.html` をブラウザで開くか、簡易サーバーを使ってください。

```bash
# Python がある場合
python3 -m http.server 5173
```

その後 http://localhost:5173 を開いてください。

## 構成

- `index.html` — ページ全体
- `styles.css` — デザイントークンとレイアウト
- `main.js` — FAQ アコーディオン / フォーム補助
- `assets/` — Figma から書き出した画像・SVG
