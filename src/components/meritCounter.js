/**
 * MeritCounter 組件邏輯
 * @description 此檔案包含 MeritCounter 組件的核心邏輯，用於測試
 *              實際的 React 組件在 index.html 中定義
 */

/**
 * 取得 MeritCounter 的樣式屬性
 * @param {number} count - 功德值
 * @returns {Object} 包含樣式屬性的物件
 * @description 此函數返回 MeritCounter 組件應該具有的樣式屬性
 *              用於屬性測試驗證樣式是否符合規格
 */
function getMeritCounterStyles(count) {
  return {
    // Monospace 字體家族
    fontFamily: "'Courier New', 'Consolas', monospace",
    
    // Neon green 顏色
    color: '#00ff00',
    
    // Text shadow 發光效果 - 多層陰影創造強烈的發光感
    textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00',
    
    // 字母間距
    letterSpacing: '0.1em',
    
    // 響應式字體大小（這裡返回兩種尺寸供測試驗證）
    fontSize: {
      mobile: '1.875rem',  // text-3xl (30px)
      desktop: '3rem'      // text-5xl (48px)
    }
  };
}

/**
 * 驗證樣式是否符合規格
 * @param {Object} styles - 要驗證的樣式物件
 * @returns {boolean} 如果樣式符合規格則返回 true
 * @description 驗證給定的樣式物件是否包含所有必需的屬性
 *              並且這些屬性的值符合設計規格
 */
function validateMeritCounterStyles(styles) {
  // 驗證 fontFamily 包含 monospace 字體
  const hasMonospaceFont = !!(styles.fontFamily && 
    (styles.fontFamily.includes('Courier') || 
     styles.fontFamily.includes('Consolas') || 
     styles.fontFamily.includes('monospace')));
  
  // 驗證顏色為 neon green (#00ff00)
  const hasNeonGreenColor = styles.color === '#00ff00';
  
  // 驗證 textShadow 包含發光效果（必須是非空字串且包含 #00ff00）
  const hasGlowEffect = !!(styles.textShadow && 
    styles.textShadow.length > 0 &&
    styles.textShadow.includes('#00ff00'));
  
  return hasMonospaceFont && hasNeonGreenColor && hasGlowEffect;
}

/**
 * 格式化功德值顯示
 * @param {number} count - 功德值
 * @returns {string} 格式化後的功德值字串
 * @description 使用千分位分隔符格式化數字，提升可讀性
 */
function formatMeritCount(count) {
  return count.toLocaleString('zh-TW');
}

module.exports = {
  getMeritCounterStyles,
  validateMeritCounterStyles,
  formatMeritCount
};
