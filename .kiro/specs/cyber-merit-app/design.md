# Design Document - Cyber Merit (賽博功德)

## Overview

Cyber Merit 是一個單頁面的互動式 Web 應用程式，採用賽博龐克美學設計。應用程式的核心是一個可點擊的 Bug 圖示，使用者每次點擊都會累積功德值，並觸發視覺、聽覺和觸覺回饋。

### 技術選型

- **React 18**: 用於組件化 UI 開發和狀態管理
- **Tailwind CSS**: 提供 utility-first 的樣式系統
- **Babel Standalone**: 在瀏覽器中即時轉譯 JSX
- **Web Audio API**: 合成電子音效
- **LocalStorage API**: 持久化功德值資料

### 架構原則

1. **單一檔案架構**: 所有 HTML、CSS、JavaScript 包含在一個檔案中
2. **無建置步驟**: 透過 CDN 和 Babel Standalone 實現零建置配置
3. **Mobile First**: 優先考慮行動裝置體驗
4. **效能優先**: 最小化 DOM 操作，使用 CSS 動畫而非 JavaScript 動畫

## Architecture

### 系統架構圖

```
┌─────────────────────────────────────────┐
│         Single HTML File                │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │   External Dependencies (CDN)     │  │
│  │  - React 18                       │  │
│  │  - ReactDOM 18                    │  │
│  │  - Babel Standalone               │  │
│  │  - Tailwind CSS                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   React Application               │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  App Component              │  │  │
│  │  │  - State Management         │  │  │
│  │  │  - Event Handlers           │  │  │
│  │  │  - LocalStorage Integration │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  UI Components              │  │  │
│  │  │  - MeritCounter             │  │  │
│  │  │  - BugIcon                  │  │  │
│  │  │  - FloatingText             │  │  │
│  │  │  - ResetButton              │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Utility Modules            │  │  │
│  │  │  - AudioSynthesizer         │  │  │
│  │  │  - StorageManager           │  │  │
│  │  │  - VibrationController      │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   Browser APIs                    │  │
│  │  - LocalStorage                   │  │
│  │  - Web Audio API                  │  │
│  │  - Vibration API                  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 組件層級結構

```
App (Root Component)
├── MeritCounter (Display Component)
├── BugIcon (Interactive Component)
│   └── FloatingText[] (Dynamic Components)
└── ResetButton (Action Component)
```

## Components and Interfaces

### 1. App Component

主要的 React 組件，負責整體狀態管理和協調子組件。

**State:**
```typescript
interface AppState {
  meritCount: number;          // 當前功德值
  floatingTexts: FloatingTextItem[];  // 活躍的飄浮文字陣列
}

interface FloatingTextItem {
  id: string;                  // 唯一識別碼
  text: string;                // 顯示文字
  x: number;                   // X 座標 (相對於視窗)
  y: number;                   // Y 座標 (相對於視窗)
}
```

**Methods:**
- `handleBugClick(event)`: 處理 Bug 圖示點擊事件
- `incrementMerit()`: 增加功德值並儲存到 LocalStorage
- `resetMerit()`: 重置功德值為 0
- `addFloatingText(x, y, text)`: 新增飄浮文字到畫面
- `removeFloatingText(id)`: 移除已完成動畫的飄浮文字

### 2. MeritCounter Component

顯示當前功德值的組件。

**Props:**
```typescript
interface MeritCounterProps {
  count: number;               // 功德值
}
```

**Styling:**
- Monospace 字體 (font-family: 'Courier New', monospace)
- Neon green 顏色 (#00ff00)
- Text shadow 發光效果
- 響應式字體大小 (mobile: 2rem, desktop: 3rem)

### 3. BugIcon Component

可點擊的 Bug 圖示組件，是應用程式的核心互動元素。

**Props:**
```typescript
interface BugIconProps {
  onClick: (event: React.MouseEvent) => void;  // 點擊事件處理器
  isAnimating: boolean;                        // 是否正在播放動畫
}
```

**Features:**
- SVG 圖示 (Bug 或晶片造型)
- Pulse 呼吸動畫 (CSS animation)
- Click 縮放回饋動畫
- Touch-action: manipulation 確保觸控反應

### 4. FloatingText Component

飄浮文字組件，顯示隨機的工程師語錄。

**Props:**
```typescript
interface FloatingTextProps {
  id: string;                  // 唯一識別碼
  text: string;                // 顯示文字
  x: number;                   // 起始 X 座標
  y: number;                   // 起始 Y 座標
  onAnimationEnd: (id: string) => void;  // 動畫結束回調
}
```

**Animation:**
- 向上移動 80-100px
- 淡出效果 (opacity: 1 → 0)
- 持續時間: 1.5 秒
- 使用 CSS animation 或 React transition

### 5. ResetButton Component

重置功德值的按鈕組件。

**Props:**
```typescript
interface ResetButtonProps {
  onClick: () => void;         // 點擊事件處理器
}
```

**Styling:**
- 低調設計，位於畫面底部
- Hover 效果
- Neon green 邊框

## Data Models

### Merit Data

功德值資料結構，儲存在 LocalStorage 中。

```typescript
interface MeritData {
  count: number;               // 功德值
  lastUpdated: string;         // 最後更新時間 (ISO 8601 格式)
}
```

**LocalStorage Key:** `cyber-merit-count`

### Floating Text Messages

預定義的飄浮文字訊息清單。

```typescript
const FLOATING_MESSAGES: string[] = [
  "Bug -1",
  "Warning -1",
  "髮量 +1",
  "肝指數 -1",
  "Deploy Success",
  "No Conflict",
  "乖乖 +1",
  "需求凍結"
];
```

### Audio Configuration

音效合成參數。

```typescript
interface AudioConfig {
  frequency: number;           // 頻率 (Hz)
  duration: number;            // 持續時間 (秒)
  type: OscillatorType;        // 波形類型 ('sine', 'square', 'sawtooth', 'triangle')
  volume: number;              // 音量 (0-1)
}

const MERIT_SOUND_CONFIG: AudioConfig = {
  frequency: 800,              // 高頻電子音
  duration: 0.1,               // 100ms
  type: 'sine',                // 正弦波
  volume: 0.3                  // 30% 音量
};
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Click increments and persists merit count

*For any* initial merit count value, when a user clicks the Bug Icon, the displayed merit count should increase by exactly one AND the new value should be immediately saved to LocalStorage.

**Validates: Requirements 1.1, 3.1**

### Property 2: Floating text appears on click

*For any* click position on the Bug Icon, a floating text element should appear in the DOM at coordinates near the click position, and the text should be randomly selected from the predefined message list.

**Validates: Requirements 1.2, 6.1**

### Property 3: Click triggers scale animation

*For any* click event on the Bug Icon, the icon element should have animation-related styling or classes applied that indicate a scale transformation is active.

**Validates: Requirements 1.3**

### Property 4: Vibration triggered on supported devices

*For any* click event on the Bug Icon, if the device supports the Vibration API (navigator.vibrate exists), then navigator.vibrate should be called with a parameter of 10 milliseconds.

**Validates: Requirements 1.4**

### Property 5: Audio synthesis on click

*For any* click event on the Bug Icon, the Web Audio API should be invoked to create and play a synthesized sound using OscillatorNode with sine wave type.

**Validates: Requirements 1.5**

### Property 6: Merit counter displays current value

*For any* merit count value stored in LocalStorage, when the Application loads, the displayed merit counter should show exactly that value.

**Validates: Requirements 2.1, 3.2**

### Property 7: UI updates immediately on state change

*For any* merit count change triggered by user interaction, the displayed value in the DOM should update synchronously to reflect the new count.

**Validates: Requirements 2.2**

### Property 8: Merit counter styling compliance

*For any* rendered merit counter element, the computed styles should include a monospace font family, neon green color (#00ff00), and text-shadow property for glow effect.

**Validates: Requirements 2.3, 4.5**

### Property 9: LocalStorage round-trip consistency

*For any* merit count value, after saving to LocalStorage and then retrieving it, the retrieved value should equal the original value.

**Validates: Requirements 3.1, 3.2**

### Property 10: Reset clears state and storage

*For any* non-zero merit count, when the reset button is clicked, both the displayed merit counter and the LocalStorage value should be set to zero.

**Validates: Requirements 3.4**

### Property 11: Floating text messages are valid

*For any* floating text generated by clicking the Bug Icon, the text content should be one of the predefined messages: "Bug -1", "Warning -1", "髮量 +1", "肝指數 -1", "Deploy Success", "No Conflict", "乖乖 +1", or "需求凍結".

**Validates: Requirements 6.1, 6.2**

### Property 12: Floating text animates and cleans up

*For any* floating text element created, it should have CSS animation properties for upward movement and fade-out, and after the animation completes, the element should be removed from the DOM.

**Validates: Requirements 6.3, 6.4**

### Property 13: Responsive layout prevents horizontal scroll

*For any* viewport width (from 320px to 1920px), the application should not cause horizontal scrolling, meaning the document width should not exceed the viewport width.

**Validates: Requirements 5.1, 5.2**

### Property 14: Touch elements have manipulation property

*For any* interactive element (Bug Icon, Reset Button), the computed style should include `touch-action: manipulation` to ensure responsive touch feedback.

**Validates: Requirements 5.5**

## Error Handling

### LocalStorage Errors

**Scenario:** LocalStorage is unavailable or quota exceeded

**Handling Strategy:**
- Wrap all localStorage operations in try-catch blocks
- If localStorage.setItem fails, log a warning to console but allow the app to continue functioning
- Merit count will still work in-memory for the current session
- Display a subtle notification to user if persistence fails

```javascript
function saveMeritCount(count) {
  try {
    localStorage.setItem('cyber-merit-count', JSON.stringify({
      count,
      lastUpdated: new Date().toISOString()
    }));
  } catch (error) {
    console.warn('Failed to save merit count:', error);
    // App continues to function without persistence
  }
}
```

### Web Audio API Errors

**Scenario:** Web Audio API is not supported or blocked by browser policy

**Handling Strategy:**
- Check for AudioContext availability before attempting to create audio
- If unavailable, silently skip audio playback
- Application remains fully functional without sound

```javascript
function playMeritSound() {
  if (!window.AudioContext && !window.webkitAudioContext) {
    return; // Silently skip if not supported
  }
  
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // ... audio synthesis code
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
}
```

### Vibration API Errors

**Scenario:** Vibration API is not supported

**Handling Strategy:**
- Check for navigator.vibrate existence before calling
- Gracefully degrade if not available
- No error message needed as vibration is a progressive enhancement

```javascript
function triggerVibration() {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
  // Silently skip if not supported
}
```

### React Rendering Errors

**Scenario:** Component throws an error during rendering

**Handling Strategy:**
- Implement Error Boundary component to catch rendering errors
- Display a fallback UI with error message
- Provide a "Reset" button to clear state and reload

```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <div className="error-fallback">
        <p>發生錯誤，請重新整理頁面</p>
        <button onClick={() => window.location.reload()}>重新載入</button>
      </div>;
    }
    return this.props.children;
  }
}
```

## Testing Strategy

### Unit Testing

我們將使用 **Jest** 和 **React Testing Library** 進行單元測試。由於這是單一 HTML 檔案的應用程式，測試環境需要額外設定來模擬瀏覽器環境。

**測試範圍：**

1. **Component Rendering Tests**
   - 驗證 App 組件正確渲染所有子組件
   - 驗證初始狀態正確顯示

2. **Event Handler Tests**
   - 測試點擊 Bug Icon 觸發正確的事件處理
   - 測試 Reset 按鈕功能

3. **LocalStorage Integration Tests**
   - 測試資料正確儲存和讀取
   - 測試初始化邏輯（空 localStorage 情況）

4. **Edge Cases**
   - 空 localStorage 時的初始化（測試 3.3）
   - 大數值的功德計數
   - 快速連續點擊的處理

### Property-Based Testing

我們將使用 **fast-check** 進行屬性測試。Fast-check 是 JavaScript/TypeScript 的屬性測試庫，類似於 Haskell 的 QuickCheck。

**配置要求：**
- 每個屬性測試至少執行 100 次迭代
- 使用 `fc.assert(fc.property(...))` 語法
- 每個測試必須標註對應的設計文件屬性編號

**測試標註格式：**
```javascript
// **Feature: cyber-merit-app, Property 1: Click increments and persists merit count**
test('clicking bug icon increments and persists count', () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 9999 }), (initialCount) => {
      // Test implementation
    }),
    { numRuns: 100 }
  );
});
```

**屬性測試清單：**

1. **Property 1: Click increments and persists merit count**
   - 生成隨機初始計數值
   - 模擬點擊事件
   - 驗證計數增加 1 且 localStorage 更新

2. **Property 2: Floating text appears on click**
   - 生成隨機點擊座標
   - 觸發點擊事件
   - 驗證飄浮文字出現且位置正確

3. **Property 4: Vibration triggered on supported devices**
   - Mock navigator.vibrate
   - 觸發點擊事件
   - 驗證 vibrate 被呼叫且參數為 10

4. **Property 5: Audio synthesis on click**
   - Mock Web Audio API
   - 觸發點擊事件
   - 驗證 OscillatorNode 被創建且配置正確

5. **Property 6: Merit counter displays current value**
   - 生成隨機計數值並存入 localStorage
   - 渲染應用程式
   - 驗證顯示值正確

6. **Property 9: LocalStorage round-trip consistency**
   - 生成隨機計數值
   - 儲存到 localStorage
   - 讀取並比較
   - 驗證值完全相同

7. **Property 10: Reset clears state and storage**
   - 生成隨機非零計數值
   - 點擊重置按鈕
   - 驗證計數和 localStorage 都為 0

8. **Property 11: Floating text messages are valid**
   - 多次觸發點擊（生成隨機次數）
   - 收集所有飄浮文字內容
   - 驗證每個文字都在預定義清單中

9. **Property 13: Responsive layout prevents horizontal scroll**
   - 生成隨機視窗寬度（320-1920px）
   - 渲染應用程式
   - 驗證 document.body.scrollWidth <= window.innerWidth

**測試工具設定：**

```javascript
// 使用 jsdom 模擬瀏覽器環境
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock Web Audio API
global.AudioContext = jest.fn().mockImplementation(() => ({
  createOscillator: jest.fn().mockReturnValue({
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    frequency: { value: 0 }
  }),
  createGain: jest.fn().mockReturnValue({
    connect: jest.fn(),
    gain: { value: 0 }
  }),
  destination: {}
}));
```

### Integration Testing

由於這是單一頁面應用程式，整合測試將專注於：

1. **完整使用者流程**
   - 載入應用程式 → 點擊 Bug Icon → 驗證所有效果（計數、音效、動畫、飄浮文字）
   - 重新整理頁面 → 驗證計數保留
   - 點擊重置 → 驗證所有狀態清空

2. **跨瀏覽器測試**
   - 使用 Playwright 或 Puppeteer 在 Chrome、Safari、Firefox 上測試
   - 驗證觸控事件在行動裝置模擬器上正常運作

3. **效能測試**
   - 快速連續點擊 100 次，驗證應用程式不會卡頓
   - 驗證飄浮文字正確清理，不會造成記憶體洩漏

## Implementation Notes

### CSS Animation Strategy

使用 Tailwind CSS 的 animation utilities 和自訂 keyframes：

```css
@keyframes pulse-glow {
  0%, 100% { 
    transform: scale(1);
    filter: drop-shadow(0 0 10px #00ff00);
  }
  50% { 
    transform: scale(1.05);
    filter: drop-shadow(0 0 20px #00ff00);
  }
}

@keyframes float-up {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px);
    opacity: 0;
  }
}
```

### Performance Optimization

1. **Debounce Click Events**: 防止過快點擊造成效能問題
2. **Limit Floating Texts**: 同時最多顯示 10 個飄浮文字，超過則移除最舊的
3. **Use CSS Transforms**: 動畫使用 transform 和 opacity，避免觸發 layout reflow
4. **Memoization**: 使用 React.memo 包裝純展示組件

### Accessibility Considerations

雖然規格未明確要求，但建議加入基本的無障礙支援：

1. **Keyboard Support**: Bug Icon 可用 Enter/Space 鍵觸發
2. **ARIA Labels**: 為互動元素添加 aria-label
3. **Focus Indicators**: 鍵盤焦點時顯示明顯的邊框
4. **Screen Reader**: 功德值變化時使用 aria-live 區域通知

### Browser Compatibility

**目標瀏覽器：**
- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- iOS Safari 14+
- Android Chrome 90+

**Polyfills 需求：**
- 不需要額外 polyfills，所有使用的 API 在目標瀏覽器中都有原生支援

### File Structure

由於是單一 HTML 檔案，結構如下：

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <!-- Meta tags -->
  <!-- Tailwind CSS CDN -->
  <!-- Custom styles -->
</head>
<body>
  <!-- React root -->
  <div id="root"></div>
  
  <!-- React, ReactDOM, Babel CDN -->
  <!-- Application code in script type="text/babel" -->
</body>
</html>
```

### Development Workflow

1. **開發階段**: 直接在瀏覽器中開啟 HTML 檔案，Babel Standalone 會即時轉譯
2. **測試階段**: 使用 Jest + jsdom 執行單元測試和屬性測試
3. **部署階段**: 直接部署單一 HTML 檔案到靜態主機（GitHub Pages、Netlify 等）

### Security Considerations

1. **XSS Prevention**: 使用 React 的自動 escaping，避免直接操作 innerHTML
2. **CSP Headers**: 如果部署到伺服器，建議設定 Content-Security-Policy
3. **LocalStorage Limits**: 不儲存敏感資料，僅儲存功德計數值
