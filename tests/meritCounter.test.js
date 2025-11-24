// **Feature: cyber-merit-app, Property 8: Merit counter styling compliance**
// **Validates: Requirements 2.3, 4.5**

const fc = require('fast-check');
const { getMeritCounterStyles, validateMeritCounterStyles, formatMeritCount } = require('./meritCounter');

describe('MeritCounter 組件樣式', () => {
  describe('Property 8: Merit counter styling compliance', () => {
    test('對於任意功德值，MeritCounter 的樣式應該包含 monospace 字體、neon green 顏色和 text-shadow 發光效果', () => {
      fc.assert(
        fc.property(
          // 生成 0 到 999999 之間的隨機整數作為功德值
          fc.integer({ min: 0, max: 999999 }),
          (meritCount) => {
            // 取得 MeritCounter 的樣式
            const styles = getMeritCounterStyles(meritCount);
            
            // 驗證：樣式應該包含 monospace 字體
            const hasMonospaceFont = styles.fontFamily && 
              (styles.fontFamily.includes('Courier') || 
               styles.fontFamily.includes('Consolas') || 
               styles.fontFamily.includes('monospace'));
            
            // 驗證：顏色應該為 neon green (#00ff00)
            const hasNeonGreenColor = styles.color === '#00ff00';
            
            // 驗證：應該有 text-shadow 發光效果
            const hasTextShadow = styles.textShadow && 
              styles.textShadow.includes('#00ff00');
            
            // 所有驗證都應該通過
            return hasMonospaceFont && hasNeonGreenColor && hasTextShadow;
          }
        ),
        { numRuns: 100 } // 執行 100 次迭代
      );
    });

    test('MeritCounter 樣式應該包含正確的 fontFamily', () => {
      const styles = getMeritCounterStyles(0);
      
      // 驗證 fontFamily 包含 Courier New 或 Consolas 或 monospace
      expect(styles.fontFamily).toMatch(/Courier|Consolas|monospace/);
    });

    test('MeritCounter 樣式應該使用 neon green 顏色 (#00ff00)', () => {
      const styles = getMeritCounterStyles(0);
      
      // 驗證顏色為 #00ff00
      expect(styles.color).toBe('#00ff00');
    });

    test('MeritCounter 樣式應該包含 text-shadow 發光效果', () => {
      const styles = getMeritCounterStyles(0);
      
      // 驗證 textShadow 存在且包含 #00ff00
      expect(styles.textShadow).toBeDefined();
      expect(styles.textShadow).toContain('#00ff00');
      
      // 驗證 textShadow 包含多層陰影（至少兩層）
      const shadowLayers = styles.textShadow.split(',').length;
      expect(shadowLayers).toBeGreaterThanOrEqual(2);
    });

    test('MeritCounter 應該支援響應式字體大小', () => {
      const styles = getMeritCounterStyles(0);
      
      // 驗證包含 mobile 和 desktop 字體大小
      expect(styles.fontSize).toBeDefined();
      expect(styles.fontSize.mobile).toBeDefined();
      expect(styles.fontSize.desktop).toBeDefined();
      
      // 驗證 mobile 字體大小為 text-3xl (1.875rem)
      expect(styles.fontSize.mobile).toBe('1.875rem');
      
      // 驗證 desktop 字體大小為 text-5xl (3rem)
      expect(styles.fontSize.desktop).toBe('3rem');
    });

    test('validateMeritCounterStyles 應該正確驗證符合規格的樣式', () => {
      const validStyles = {
        fontFamily: "'Courier New', monospace",
        color: '#00ff00',
        textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00'
      };
      
      expect(validateMeritCounterStyles(validStyles)).toBe(true);
    });

    test('validateMeritCounterStyles 應該拒絕不符合規格的樣式', () => {
      // 缺少 monospace 字體
      const invalidStyles1 = {
        fontFamily: 'Arial, sans-serif',
        color: '#00ff00',
        textShadow: '0 0 10px #00ff00'
      };
      expect(validateMeritCounterStyles(invalidStyles1)).toBe(false);
      
      // 錯誤的顏色
      const invalidStyles2 = {
        fontFamily: 'Courier New, monospace',
        color: '#ff0000',
        textShadow: '0 0 10px #00ff00'
      };
      expect(validateMeritCounterStyles(invalidStyles2)).toBe(false);
      
      // 缺少 text-shadow
      const invalidStyles3 = {
        fontFamily: 'Courier New, monospace',
        color: '#00ff00',
        textShadow: ''
      };
      expect(validateMeritCounterStyles(invalidStyles3)).toBe(false);
    });

    test('formatMeritCount 應該正確格式化功德值', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 999999 }),
          (count) => {
            const formatted = formatMeritCount(count);
            
            // 驗證：格式化後的字串應該是字串類型
            expect(typeof formatted).toBe('string');
            
            // 驗證：格式化後的字串應該包含數字
            expect(formatted).toMatch(/\d/);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('formatMeritCount 應該為大數字添加千分位分隔符', () => {
      // 測試 1000 應該格式化為 "1,000"
      expect(formatMeritCount(1000)).toContain(',');
      
      // 測試 1000000 應該格式化為 "1,000,000"
      expect(formatMeritCount(1000000)).toContain(',');
      
      // 測試小於 1000 的數字不應該有分隔符
      const smallNumber = formatMeritCount(999);
      expect(smallNumber).not.toContain(',');
    });

    test('MeritCounter 樣式在不同功德值下應該保持一致', () => {
      fc.assert(
        fc.property(
          // 生成兩個不同的功德值
          fc.tuple(
            fc.integer({ min: 0, max: 999999 }),
            fc.integer({ min: 0, max: 999999 })
          ),
          ([count1, count2]) => {
            const styles1 = getMeritCounterStyles(count1);
            const styles2 = getMeritCounterStyles(count2);
            
            // 驗證：無論功德值如何，樣式屬性應該保持一致
            expect(styles1.fontFamily).toBe(styles2.fontFamily);
            expect(styles1.color).toBe(styles2.color);
            expect(styles1.textShadow).toBe(styles2.textShadow);
            expect(styles1.letterSpacing).toBe(styles2.letterSpacing);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
