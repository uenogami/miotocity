# 澪都市公式ウェブサイト

## ローカルサーバーの起動方法

このウェブサイトは、共通コンテンツ（ヘッダー・フッター）を動的に読み込むため、ローカルサーバーが必要です。

### Pythonを使用する場合

```bash
# Python 3の場合
python3 -m http.server 8000

# ブラウザで以下にアクセス
# http://localhost:8000
```

### Node.jsを使用する場合

```bash
# http-serverをインストール（初回のみ）
npm install -g http-server

# サーバーを起動
http-server -p 8000

# ブラウザで以下にアクセス
# http://localhost:8000
```

### VS CodeのLive Server拡張機能を使用する場合

1. VS Codeで「Live Server」拡張機能をインストール
2. `index.html`を右クリック
3. 「Open with Live Server」を選択

## 注意事項

- `file://`プロトコルで直接HTMLファイルを開くと、共通コンテンツの読み込みに失敗します
- 必ずローカルサーバーを使用してください

