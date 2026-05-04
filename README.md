# SpeakBraker - マイク入力遅延再生 Webアプリ

## 概要
マイクから入力された音声を遅延再生するシンプルなWebアプリです。現在は1〜5秒の遅延を選択できます。

## 機能
- ✅ Webブラウザ上で動作する静的サイト
- ✅ マイク入力をリアルタイムでキャプチャ
- ✅ 1〜5秒の遅延再生
- ✅ シンプルなUIとレスポンシブデザイン

## プロジェクト構成
```
SpeakBraker/
├── index.html       # メインページ
├── style.css        # スタイルシート
├── script.js        # オーディオ処理ロジック
├── README.md        # ドキュメント
├── .gitignore       # Git管理除外設定
└── Sources/         # 今後の拡張用ディレクトリ
```

## GitHub Pages 公開手順

### 1. Git リポジトリの初期化
```bash
cd /Users/yanotsukasa/SpeakBraker
git init
git add .
git commit -m "Initial commit for GitHub Pages"
```

### 2. GitHub にリポジトリを作成
1. GitHub にログイン
2. 新しいリポジトリを作成
   - リポジトリ名: `SpeakBraker`
   - 公開設定: Public
   - README は既存のものを使うので新規作成は不要

### 3. リモートを追加して push
```bash
git remote add origin https://github.com/<ユーザー名>/SpeakBraker.git
git branch -M main
git push -u origin main
```

### 4. GitHub Pages を有効化
1. GitHub リポジトリの `Settings` を開く
2. 左側メニューから `Pages` を選択
3. `Source` は `main` / `root` を選択
4. `Save` をクリック
5. 数分後、公開URLが表示されます

> 例: `https://<ユーザー名>.github.io/SpeakBraker/`

### 5. すぐに公開確認
ブラウザで `https://<ユーザー名>.github.io/SpeakBraker/` を開いて、アプリが表示されるか確認します。

## ローカルでのテスト

### Python を使う場合
```bash
cd /Users/yanotsukasa/SpeakBraker
python3 -m http.server 8000
```
ブラウザで `http://localhost:8000`

### Node.js http-server を使う場合
```bash
npm install -g http-server
cd /Users/yanotsukasa/SpeakBraker
http-server -p 8000
```
ブラウザで `http://localhost:8000`

### VS Code の Live Server を使う場合
- `Live Server` 拡張機能をインストール
- `index.html` を右クリックして `Open with Live Server`

## 使い方

1. ブラウザでアプリを開く
2. `遅延秒数` を選択
3. **「開始」** ボタンをクリック
4. マイクへのアクセスを許可
5. 話した音声が選択した秒数だけ遅れて再生されます

## 技術仕様

- **HTML5 / CSS3 / JavaScript**
- **Web Audio API** を使用
- **遅延時間**: 1〜5秒
- **ブラウザ互換性**: Chrome、Firefox、Safari、Edge
- **データ保存**: なし（ローカル処理のみ）

## 注意事項

- Webブラウザでマイク許可が必要です
- HTTPS で公開することを推奨します
- GitHub Pages は HTTPS を自動で有効化します

## サポート

- ブラウザの開発者コンソールを確認してエラーを特定
- マイクが動作しない場合、ブラウザ権限設定を確認

## ライセンス
MIT License

## 作成日
2026年5月4日
