// **Feature: cyber-merit-app, Property 4: Vibration triggered on supported devices**
// **Validates: Requirements 1.4**

const fc = require('fast-check');
const { triggerVibration } = require('./vibration');

describe('震動控制函數', () => {
  let originalNavigator;

  beforeEach(() => {
    // 儲存原始的 navigator
    originalNavigator = global.navigator;
    // 清除 jest 的 mock 計數器
    jest.clearAllMocks();
  });

  afterEach(() => {
    // 恢復原始的 navigator
    global.navigator = originalNavigator;
  });

  describe('Property 4: Vibration triggered on supported devices', () => {
    test('對於任意點擊事件，在支援震動的裝置上應該呼叫 navigator.vibrate 並傳入 10 毫秒', () => {
      fc.assert(
        fc.property(
          // 生成隨機的點擊次數來模擬多次點擊
          fc.integer({ min: 1, max: 20 }),
          (clickCount) => {
            // Mock navigator.vibrate directly on the navigator object
            const mockVibrate = jest.fn();
            Object.defineProperty(navigator, 'vibrate', {
              value: mockVibrate,
              writable: true,
              configurable: true
            });
            
            // 模擬多次點擊
            for (let i = 0; i < clickCount; i++) {
              triggerVibration();
            }
            
            // 驗證：navigator.vibrate 應該被呼叫正確的次數
            expect(mockVibrate).toHaveBeenCalledTimes(clickCount);
            
            // 驗證：每次呼叫都應該傳入 10 毫秒作為參數
            for (let i = 0; i < clickCount; i++) {
              expect(mockVibrate).toHaveBeenNthCalledWith(i + 1, 10);
            }
            
            // 清理 mock
            delete navigator.vibrate;
            
            return true;
          }
        ),
        { numRuns: 100 } // 執行 100 次迭代
      );
    });

    test('當裝置不支援震動 API 時，應該靜默跳過而不拋出錯誤', () => {
      // Mock navigator 沒有 vibrate 方法
      global.navigator = {};
      
      // 應該不拋出錯誤
      expect(() => triggerVibration()).not.toThrow();
    });

    test('當 navigator 不存在時，應該靜默跳過而不拋出錯誤', () => {
      // 移除 navigator
      global.navigator = undefined;
      
      // 應該不拋出錯誤
      expect(() => triggerVibration()).not.toThrow();
    });

    test('應該使用正確的震動持續時間（10 毫秒）', () => {
      const mockVibrate = jest.fn();
      Object.defineProperty(navigator, 'vibrate', {
        value: mockVibrate,
        writable: true,
        configurable: true
      });
      
      triggerVibration();
      
      // 驗證震動持續時間為 10 毫秒
      expect(mockVibrate).toHaveBeenCalledWith(10);
      
      // 清理 mock
      delete navigator.vibrate;
    });

    test('對於不同的點擊位置，震動行為應該一致', () => {
      fc.assert(
        fc.property(
          // 生成隨機的點擊座標（模擬不同位置的點擊）
          fc.tuple(
            fc.integer({ min: 0, max: 1920 }), // x 座標
            fc.integer({ min: 0, max: 1080 })  // y 座標
          ),
          ([x, y]) => {
            // Mock navigator.vibrate directly on the navigator object
            const mockVibrate = jest.fn();
            Object.defineProperty(navigator, 'vibrate', {
              value: mockVibrate,
              writable: true,
              configurable: true
            });
            
            // 觸發震動（點擊位置不影響震動行為）
            triggerVibration();
            
            // 驗證：無論點擊位置如何，都應該呼叫 vibrate(10)
            expect(mockVibrate).toHaveBeenCalledWith(10);
            expect(mockVibrate).toHaveBeenCalledTimes(1);
            
            // 清理 mock
            delete navigator.vibrate;
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
