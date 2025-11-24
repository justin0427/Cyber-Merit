# 賽博功德 Cyber Merit App

一個賽博龐克風格的功德累積應用程式，使用 React + Tailwind CSS 開發。

## 📁 專案結構

```
KiroWeb/
├── src/                      # 原始碼目錄
│   ├── components/           # React 組件
│   │   └── meritCounter.js   # 功德計數器組件
│   ├── utils/                # 工具函數
│   │   ├── audio.js          # 音效播放功能
│   │   ├── localStorage.js   # LocalStorage 管理
│   │   └── vibration.js      # 震動回饋功能
│   └── styles/               # 樣式檔案（預留）
│
├── tests/                    # 測試檔案
│   ├── app.test.js
│   ├── audio.test.js
│   ├── bugIcon.test.js
│   ├── floatingText.test.js
│   ├── handleBugClick.test.js
│   ├── localStorage.test.js
│   ├── meritCounter.test.js
│   └── vibration.test.js
│
├── .kiro/                    # Kiro 設定檔
│   ├── specs/                # 功能規格文件
│   └── steering/             # 開發指引
│
├── index.html                # 主要 HTML 檔案（包含完整應用程式）
├── package.json              # 專案依賴設定
├── jest.config.js            # Jest 測試設定
├── jest.setup.js             # Jest 初始化設定
└── babel.config.js           # Babel 轉譯設定

```

## 🚀 快速開始

### 安裝依賴
```bash
npm install
```

### 執行測試
```bash
npm test
```

### 開啟應用程式
直接在瀏覽器中開啟 `index.html` 即可使用。

## 🎨 技術堆疊

- **Framework:** React 18 (Functional Components + Hooks)
- **Styling:** Tailwind CSS
- **Testing:** Jest + Testing Library
- **Build:** Babel Standalone (瀏覽器端轉譯)

## 📝 功能特色

- ✨ 賽博龐克風格 UI（Neon Green + Dark Theme）
- 🐛 點擊 Bug Icon 累積功德值
- 💾 LocalStorage 持久化儲存
- 🎵 Web Audio API 音效回饋
- 📳 震動回饋（支援的裝置）
- 🎭 飄浮文字動畫效果
- 📱 響應式設計（Mobile First）

## 🧪 測試

專案包含完整的單元測試，使用 Jest 和 Testing Library。

執行測試：
```bash
npm test
```

監聽模式：
```bash
npm run test:watch
```
