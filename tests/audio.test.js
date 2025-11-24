// **Feature: cyber-merit-app, Property 5: Audio synthesis on click**
// **Validates: Requirements 1.5**

const fc = require('fast-check');
const { playMeritSound } = require('./audio');

describe('Web Audio API 音效合成函數', () => {
  // Mock Web Audio API
  let mockAudioContext;
  let mockOscillator;
  let mockGainNode;
  let originalAudioContext;
  let originalWebkitAudioContext;

  beforeEach(() => {
    // 儲存原始的 AudioContext
    originalAudioContext = global.AudioContext;
    originalWebkitAudioContext = global.webkitAudioContext;

    // 建立 mock 物件
    mockOscillator = {
      type: '',
      frequency: { value: 0 },
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      onended: null
    };

    mockGainNode = {
      gain: { value: 0 },
      connect: jest.fn()
    };

    mockAudioContext = {
      currentTime: 0,
      destination: {},
      createOscillator: jest.fn(() => mockOscillator),
      createGain: jest.fn(() => mockGainNode),
      close: jest.fn()
    };

    // Mock AudioContext 建構函數
    global.AudioContext = jest.fn(() => mockAudioContext);
  });

  afterEach(() => {
    // 恢復原始的 AudioContext
    global.AudioContext = originalAudioContext;
    global.webkitAudioContext = originalWebkitAudioContext;
  });

  describe('Property 5: Audio synthesis on click', () => {
    test('對於任意點擊事件，應該使用 Web Audio API 建立並播放正弦波音效', () => {
      fc.assert(
        fc.property(
          // 生成隨機的點擊次數來模擬多次點擊
          fc.integer({ min: 1, max: 10 }),
          (clickCount) => {
            // 重置 mock 計數器
            jest.clearAllMocks();
            
            // 模擬多次點擊
            for (let i = 0; i < clickCount; i++) {
              playMeritSound();
            }
            
            // 驗證：AudioContext 應該被建立
            expect(global.AudioContext).toHaveBeenCalledTimes(clickCount);
            
            // 驗證：OscillatorNode 應該被建立
            expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(clickCount);
            
            // 驗證：GainNode 應該被建立
            expect(mockAudioContext.createGain).toHaveBeenCalledTimes(clickCount);
            
            // 驗證：振盪器類型應該設定為 'sine'
            expect(mockOscillator.type).toBe('sine');
            
            // 驗證：頻率應該設定為 800Hz
            expect(mockOscillator.frequency.value).toBe(800);
            
            // 驗證：音量應該設定為 0.3 (30%)
            expect(mockGainNode.gain.value).toBe(0.3);
            
            // 驗證：oscillator 應該連接到 gainNode
            expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode);
            
            // 驗證：gainNode 應該連接到 destination
            expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
            
            // 驗證：oscillator 應該開始播放
            expect(mockOscillator.start).toHaveBeenCalledWith(mockAudioContext.currentTime);
            
            // 驗證：oscillator 應該在 0.1 秒後停止
            expect(mockOscillator.stop).toHaveBeenCalledWith(mockAudioContext.currentTime + 0.1);
            
            return true;
          }
        ),
        { numRuns: 100 } // 執行 100 次迭代
      );
    });

    test('當 AudioContext 不可用時，應該靜默跳過而不拋出錯誤', () => {
      // 移除 AudioContext 和 webkitAudioContext
      delete global.AudioContext;
      delete global.webkitAudioContext;
      
      // 應該不拋出錯誤
      expect(() => playMeritSound()).not.toThrow();
    });

    test('當 AudioContext 建立失敗時，應該捕獲錯誤並記錄警告', () => {
      // Mock console.warn
      const originalWarn = console.warn;
      console.warn = jest.fn();
      
      // Mock AudioContext 拋出錯誤
      global.AudioContext = jest.fn(() => {
        throw new Error('AudioContext creation failed');
      });
      
      // 應該不拋出錯誤
      expect(() => playMeritSound()).not.toThrow();
      
      // 應該記錄警告
      expect(console.warn).toHaveBeenCalledWith(
        '音效播放失敗:',
        expect.any(Error)
      );
      
      // 恢復 console.warn
      console.warn = originalWarn;
    });

    test('應該在音效播放完畢後關閉 AudioContext', () => {
      playMeritSound();
      
      // 驗證 onended 回調已設定
      expect(mockOscillator.onended).toBeDefined();
      expect(typeof mockOscillator.onended).toBe('function');
      
      // 模擬音效播放完畢
      mockOscillator.onended();
      
      // 驗證 AudioContext 已關閉
      expect(mockAudioContext.close).toHaveBeenCalled();
    });

    test('支援 webkitAudioContext 作為後備方案', () => {
      // 移除標準的 AudioContext
      delete global.AudioContext;
      
      // 設定 webkitAudioContext
      global.webkitAudioContext = jest.fn(() => mockAudioContext);
      
      playMeritSound();
      
      // 驗證 webkitAudioContext 被使用
      expect(global.webkitAudioContext).toHaveBeenCalled();
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });
  });
});
