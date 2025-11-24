# Implementation Plan - Cyber Merit (賽博功德)

- [x] 1. 建立 HTML 基礎結構和 CDN 依賴
  - 創建單一 HTML 檔案 (index.html)
  - 引入 React 18、ReactDOM 18、Babel Standalone 和 Tailwind CSS 的 CDN 連結
  - 設定 HTML meta tags（viewport、charset、title）
  - 建立 root div 供 React 掛載
  - 設定 script 標籤 type="text/babel" 以啟用 JSX 轉譯
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 2. 實作賽博龐克視覺風格和自訂 CSS
  - 在 style 標籤中定義全域樣式（背景色 #050505、防止橫向捲軸）
  - 實作 grid pattern 背景裝飾
  - 定義 pulse-glow 呼吸動畫的 @keyframes
  - 定義 float-up 飄浮文字動畫的 @keyframes
  - 定義 click-scale 點擊縮放動畫的 @keyframes
  - 設定 neon green (#00ff00) 發光效果的 CSS 變數
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 3. 實作 LocalStorage 管理工具函數
  - 撰寫 saveMeritCount(count) 函數，包含錯誤處理
  - 撰寫 loadMeritCount() 函數，處理空值情況並返回 0
  - 撰寫 clearMeritCount() 函數
  - 加入詳細的繁體中文註解說明每個函數的用途
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 8.1, 8.2_

- [x] 3.1 撰寫 LocalStorage round-trip 屬性測試
  - **Property 9: LocalStorage round-trip consistency**
  - **Validates: Requirements 3.1, 3.2**

- [x] 4. 實作 Web Audio API 音效合成函數
  - 撰寫 playMeritSound() 函數
  - 使用 AudioContext 和 OscillatorNode 合成正弦波
  - 設定頻率 800Hz、持續時間 100ms、音量 30%
  - 加入瀏覽器相容性檢查和錯誤處理
  - 加入詳細的繁體中文註解
  - _Requirements: 1.5, 7.5, 8.2_

- [x] 4.1 撰寫音效合成屬性測試
  - **Property 5: Audio synthesis on click**
  - **Validates: Requirements 1.5**

- [x] 5. 實作震動控制函數
  - 撰寫 triggerVibration() 函數
  - 檢查 navigator.vibrate 是否存在
  - 觸發 10 毫秒震動
  - 加入繁體中文註解
  - _Requirements: 1.4, 8.2_

- [x] 5.1 撰寫震動觸發屬性測試
  - **Property 4: Vibration triggered on supported devices**
  - **Validates: Requirements 1.4**

- [x] 6. 實作 Bug Icon SVG 圖示
  - 設計並撰寫 inline SVG 的 Bug 或晶片圖示
  - 使用 neon green (#00ff00) 作為主色
  - 確保 SVG 在不同尺寸下都清晰可見
  - 加入 viewBox 和 responsive 屬性
  - _Requirements: 7.4_

- [x] 7. 實作 FloatingText 組件
  - 建立 FloatingText 函數組件，接收 id、text、x、y、onAnimationEnd props
  - 使用 absolute positioning 定位到點擊座標
  - 套用 float-up CSS 動畫
  - 監聽 animationend 事件並呼叫 onAnimationEnd 回調
  - 加入繁體中文註解說明組件用途
  - _Requirements: 1.2, 6.3, 6.4, 8.2_

- [x] 7.1 撰寫飄浮文字動畫和清理屬性測試
  - **Property 12: Floating text animates and cleans up**
  - **Validates: Requirements 6.3, 6.4**

- [x] 8. 實作 MeritCounter 組件
  - 建立 MeritCounter 函數組件，接收 count prop
  - 使用 Tailwind CSS 設定 monospace 字體
  - 套用 neon green 顏色和 text-shadow 發光效果
  - 實作響應式字體大小（mobile: text-3xl, desktop: text-5xl）
  - 加入繁體中文註解
  - _Requirements: 2.1, 2.3, 2.4, 8.2_

- [x] 8.1 撰寫功德計數器樣式屬性測試
  - **Property 8: Merit counter styling compliance**
  - **Validates: Requirements 2.3, 4.5**

- [x] 9. 實作 BugIcon 組件
  - 建立 BugIcon 函數組件，接收 onClick 和 isAnimating props
  - 整合步驟 6 的 SVG 圖示
  - 套用 pulse-glow 呼吸動畫
  - 根據 isAnimating 狀態套用 click-scale 動畫
  - 設定 touch-action: manipulation 確保觸控反應
  - 加入 cursor-pointer 和 hover 效果
  - 加入繁體中文註解
  - _Requirements: 1.3, 4.3, 5.5, 8.2_

- [x] 9.1 撰寫點擊動畫屬性測試
  - **Property 3: Click triggers scale animation**
  - **Validates: Requirements 1.3**

- [x] 9.2 撰寫觸控屬性測試
  - **Property 14: Touch elements have manipulation property**
  - **Validates: Requirements 5.5**

- [x] 10. 實作 ResetButton 組件
  - 建立 ResetButton 函數組件，接收 onClick prop
  - 設計低調的按鈕樣式（neon green 邊框、透明背景）
  - 加入 hover 和 active 狀態效果
  - 設定 touch-action: manipulation
  - 加入繁體中文註解
  - _Requirements: 3.4, 5.5, 8.2_

- [x] 11. 實作 App 主組件的狀態管理
  - 建立 App 函數組件
  - 使用 useState 管理 meritCount 和 floatingTexts 狀態
  - 使用 useEffect 在組件掛載時從 localStorage 載入功德值
  - 定義 FLOATING_MESSAGES 常數陣列（包含所有 8 個訊息）
  - 加入詳細的繁體中文註解說明狀態結構
  - _Requirements: 2.1, 3.2, 6.2, 8.1, 8.2_

- [x] 11.1 撰寫功德計數器顯示屬性測試
  - **Property 6: Merit counter displays current value**
  - **Validates: Requirements 2.1, 3.2**

- [x] 12. 實作 handleBugClick 事件處理器
  - 在 App 組件中撰寫 handleBugClick 函數
  - 增加 meritCount 狀態
  - 呼叫 saveMeritCount 儲存到 localStorage
  - 從 FLOATING_MESSAGES 隨機選取一個訊息
  - 取得點擊座標（event.clientX, event.clientY）
  - 新增 FloatingTextItem 到 floatingTexts 狀態（使用 Date.now() 生成唯一 id）
  - 呼叫 playMeritSound() 播放音效
  - 呼叫 triggerVibration() 觸發震動
  - 加入詳細的繁體中文註解說明每個步驟
  - _Requirements: 1.1, 1.2, 1.4, 1.5, 3.1, 6.1, 8.3_

- [x] 12.1 撰寫點擊增加並持久化屬性測試
  - **Property 1: Click increments and persists merit count**
  - **Validates: Requirements 1.1, 3.1**

- [x] 12.2 撰寫飄浮文字出現屬性測試
  - **Property 2: Floating text appears on click**
  - **Validates: Requirements 1.2, 6.1**

- [x] 12.3 撰寫飄浮文字訊息有效性屬性測試
  - **Property 11: Floating text messages are valid**
  - **Validates: Requirements 6.1, 6.2**

- [x] 13. 實作 resetMerit 事件處理器
  - 在 App 組件中撰寫 resetMerit 函數
  - 將 meritCount 狀態設為 0
  - 呼叫 clearMeritCount() 清空 localStorage
  - 加入繁體中文註解
  - _Requirements: 3.4, 8.2_

- [x] 13.1 撰寫重置功能屬性測試
  - **Property 10: Reset clears state and storage**
  - **Validates: Requirements 3.4**

- [x] 14. 實作 removeFloatingText 回調函數
  - 在 App 組件中撰寫 removeFloatingText 函數
  - 使用 setFloatingTexts 從陣列中移除指定 id 的項目
  - 加入繁體中文註解
  - _Requirements: 6.4, 8.2_

- [x] 15. 組裝 App 組件的 JSX 結構
  - 建立主容器 div，套用 Tailwind CSS 類別（flex、flex-col、min-h-screen 等）
  - 渲染 MeritCounter 組件並傳入 meritCount
  - 渲染 BugIcon 組件並傳入 handleBugClick 和動畫狀態
  - 使用 map 渲染所有 FloatingText 組件
  - 渲染 ResetButton 組件並傳入 resetMerit
  - 確保佈局在 mobile 和 desktop 都正確顯示
  - 加入繁體中文註解說明佈局結構
  - _Requirements: 2.1, 2.2, 5.1, 5.2, 8.2_

- [x] 15.1 撰寫 UI 即時更新屬性測試
  - **Property 7: UI updates immediately on state change**
  - **Validates: Requirements 2.2**

- [x] 15.2 撰寫響應式佈局屬性測試
  - **Property 13: Responsive layout prevents horizontal scroll**
  - **Validates: Requirements 5.1, 5.2**

- [x] 16. 實作 Error Boundary 組件
  - 建立 ErrorBoundary class 組件
  - 實作 getDerivedStateFromError 和 componentDidCatch
  - 設計錯誤 fallback UI（顯示錯誤訊息和重新載入按鈕）
  - 用 ErrorBoundary 包裹 App 組件
  - 加入繁體中文註解
  - _Requirements: 8.2_

- [x] 17. 使用 ReactDOM 渲染應用程式
  - 在 script 標籤底部撰寫 ReactDOM.createRoot 程式碼
  - 將 ErrorBoundary 包裹的 App 組件渲染到 #root
  - 加入繁體中文註解
  - _Requirements: 7.2, 8.2_

- [x] 18. 最終檢查點 - 確保所有功能正常運作
  - 在瀏覽器中開啟 index.html 檔案
  - 測試點擊 Bug Icon 是否增加功德值
  - 測試飄浮文字是否正確顯示和消失
  - 測試音效是否播放（需要使用者互動後才能播放）
  - 測試震動是否觸發（在支援的裝置上）
  - 測試重新整理頁面後功德值是否保留
  - 測試 Reset 按鈕是否正確清空功德值
  - 測試在不同視窗寬度下的響應式佈局
  - 測試在 iOS Safari 和 Android Chrome 上的相容性
  - 確保所有繁體中文註解完整且清晰
  - 如有問題，詢問使用者並進行修正
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 3.1, 3.2, 3.4, 4.1, 4.2, 4.3, 5.1, 5.2, 5.4, 6.1, 6.2, 6.3, 6.4, 8.1_
