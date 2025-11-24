// **Feature: cyber-merit-app, Property 9: LocalStorage round-trip consistency**
// **Validates: Requirements 3.1, 3.2**

const fc = require('fast-check');
const { saveMeritCount, loadMeritCount, clearMeritCount } = require('./localStorage');

describe('LocalStorage 管理工具函數', () => {
  beforeEach(() => {
    // 每個測試前清空 localStorage
    localStorage.clear();
  });

  describe('Property 9: LocalStorage round-trip consistency', () => {
    test('對於任意功德值，儲存後再載入應該得到相同的值', () => {
      fc.assert(
        fc.property(
          // 生成 0 到 999999 之間的隨機整數作為功德值
          fc.integer({ min: 0, max: 999999 }),
          (meritCount) => {
            // 清空 localStorage 確保乾淨的測試環境
            localStorage.clear();
            
            // 儲存功德值
            saveMeritCount(meritCount);
            
            // 載入功德值
            const loadedCount = loadMeritCount();
            
            // 驗證：載入的值應該等於原始值
            return loadedCount === meritCount;
          }
        ),
        { numRuns: 100 } // 執行 100 次迭代
      );
    });

    test('當 localStorage 為空時，loadMeritCount 應該返回 0', () => {
      localStorage.clear();
      const result = loadMeritCount();
      expect(result).toBe(0);
    });

    test('saveMeritCount 應該儲存包含 count 和 lastUpdated 的資料', () => {
      const testCount = 42;
      saveMeritCount(testCount);
      
      const storedData = localStorage.getItem('cyber-merit-count');
      expect(storedData).not.toBeNull();
      
      const parsedData = JSON.parse(storedData);
      expect(parsedData.count).toBe(testCount);
      expect(parsedData.lastUpdated).toBeDefined();
      expect(typeof parsedData.lastUpdated).toBe('string');
    });

    test('clearMeritCount 應該移除 localStorage 中的資料', () => {
      // 先儲存一個值
      saveMeritCount(100);
      expect(localStorage.getItem('cyber-merit-count')).not.toBeNull();
      
      // 清除
      clearMeritCount();
      expect(localStorage.getItem('cyber-merit-count')).toBeNull();
      
      // 載入應該返回 0
      expect(loadMeritCount()).toBe(0);
    });

    test('loadMeritCount 應該處理無效的 JSON 資料', () => {
      // 儲存無效的 JSON
      localStorage.setItem('cyber-merit-count', 'invalid json');
      
      // 應該返回 0 而不是拋出錯誤
      const result = loadMeritCount();
      expect(result).toBe(0);
    });

    test('loadMeritCount 應該處理缺少 count 欄位的資料', () => {
      // 儲存沒有 count 欄位的資料
      localStorage.setItem('cyber-merit-count', JSON.stringify({ lastUpdated: '2024-01-01' }));
      
      // 應該返回 0
      const result = loadMeritCount();
      expect(result).toBe(0);
    });

    test('loadMeritCount 應該處理 count 不是數字的情況', () => {
      // 儲存 count 為字串的資料
      localStorage.setItem('cyber-merit-count', JSON.stringify({ count: 'not a number' }));
      
      // 應該返回 0
      const result = loadMeritCount();
      expect(result).toBe(0);
    });
  });

  describe('Property 10: Reset clears state and storage', () => {
    // **Feature: cyber-merit-app, Property 10: Reset clears state and storage**
    // **Validates: Requirements 3.4**
    
    test('對於任意非零功德值，重置後 localStorage 和載入的值都應該為 0', () => {
      fc.assert(
        fc.property(
          // 生成 1 到 999999 之間的隨機整數作為非零功德值
          fc.integer({ min: 1, max: 999999 }),
          (nonZeroMeritCount) => {
            // 清空 localStorage 確保乾淨的測試環境
            localStorage.clear();
            
            // 儲存非零功德值到 localStorage
            saveMeritCount(nonZeroMeritCount);
            
            // 驗證功德值已正確儲存
            const savedCount = loadMeritCount();
            if (savedCount !== nonZeroMeritCount) {
              return false; // 如果儲存失敗，測試失敗
            }
            
            // 執行重置操作：清空 localStorage
            clearMeritCount();
            
            // 驗證 1: localStorage 中的資料應該被移除
            const storageData = localStorage.getItem('cyber-merit-count');
            const storageCleared = storageData === null;
            
            // 驗證 2: 載入功德值應該返回 0
            const loadedCount = loadMeritCount();
            const loadReturnsZero = loadedCount === 0;
            
            // 兩個條件都必須滿足
            return storageCleared && loadReturnsZero;
          }
        ),
        { numRuns: 100 } // 執行 100 次迭代
      );
    });

    test('重置後再次儲存新值應該正常運作', () => {
      // 這個測試確保重置不會破壞 localStorage 的功能
      const initialCount = 100;
      const newCount = 50;
      
      // 儲存初始值
      saveMeritCount(initialCount);
      expect(loadMeritCount()).toBe(initialCount);
      
      // 重置
      clearMeritCount();
      expect(loadMeritCount()).toBe(0);
      
      // 儲存新值
      saveMeritCount(newCount);
      expect(loadMeritCount()).toBe(newCount);
    });
  });
});
