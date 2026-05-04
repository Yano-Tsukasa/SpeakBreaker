# SpeakBreaker

リアルタイムのマイク入力音声を遅延再生するシンプルなWebアプリです。  
Web Audio API を利用し，ブラウザ上で動作します。

---

## Features

- マイク入力をリアルタイム取得
- 1〜5秒の遅延再生
- ブラウザのみで動作
- シンプルなUI
- レスポンシブデザイン

---

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Web Audio API

---

## Project Structure

```text
SpeakBreaker/
├── index.html
├── style.css
├── script.js
├── README.md
├── .gitignore
└── Sources/
```

---

## Run Locally

### Python

```bash
python3 -m http.server 8000
```

ブラウザで：

```text
http://localhost:8000
```

---

### Node.js

```bash
npm install -g http-server
http-server -p 8000
```

ブラウザで：

```text
http://localhost:8000
```

---

## Usage

1. アプリを開く
2. 遅延秒数を選択
3. 「開始」ボタンをクリック
4. マイクアクセスを許可
5. 入力音声が遅延再生されます

---

## Browser Support

- Chrome
- Firefox
- Safari
- Edge

---

## Notes

- マイク権限が必要です
- HTTPS環境での利用を推奨します
- GitHub Pages は HTTPS を自動有効化します

---

## License

MIT License