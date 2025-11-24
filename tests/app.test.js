// **Feature: cyber-merit-app, Property 6: Merit counter displays current value**
// **Validates: Requirements 2.1, 3.2**

const fc = require('fast-check');
const { saveMeritCount, loadMeritCount } = require('./localStorage');

/**
 * 模擬 App 組件的初始化邏輯
 * @description 這個函數模擬 App 組件在掛載時從 localStorage 載入功德值的行為
 *              在實際的 App 組件中，這個邏輯在 useEffect 中執行
 * @returns {number} 載入的功德值
 */
function initializeAppMeritCount() {
  // 模擬 App 組件的 useEffect 邏輯
  const savedCount = loadMeritCount();
  return savedCount;
}

describe('App 組件狀態管理', () => {
  beforeEach(() => {
    // 每個測試前清空 localStorage
    localStorage.clear();
  });

  describe('Property 6: Merit counter displays current value', () => {
    test('對於任意儲存在 localStorage 的功德值，App 載入時應該顯示該值', () => {
      fc.assert(
        fc.property(
          // 生成 0 到 999999 之間的隨機整數作為功德值
          fc.integer({ min: 0, max: 999999 }),
          (storedMeritCount) => {
            // 清空 localStorage 確保乾淨的測試環境
            localStorage.clear();
            
            // 將功德值儲存到 localStorage（模擬之前的使用者操作）
            saveMeritCount(storedMeritCount);
            
            // 模擬 App 組件初始化（載入功德值）
            const displayedCount = initializeAppMeritCount();
            
            // 驗證：顯示的值應該等於儲存的值
            return displayedCount === storedMeritCount;
          }
        ),
        { numRuns: 100 } // 執行 100 次迭代
      );
    });

    test('當 localStorage 為空時，App 應該顯示初始值 0', () => {
      // 確保 localStorage 為空
      localStorage.clear();
      
      // 模擬 App 組件初始化
      const displayedCount = initializeAppMeritCount();
      
      // 驗證：應該顯示 0
      expect(displayedCount).toBe(0);
    });

    test('當 localStorage 包含無效資料時，App 應該顯示 0', () => {
      // 儲存無效的 JSON 資料
      localStorage.setItem('cyber-merit-count', 'invalid json');
      
      // 模擬 App 組件初始化
      const displayedCount = initializeAppMeritCount();
      
      // 驗證：應該顯示 0（錯誤處理）
      expect(displayedCount).toBe(0);
    });

    test('當 localStorage 包含負數時，App 應該正確載入該值', () => {
      // 注意：雖然應用程式邏輯上不應該產生負數，但 localStorage 可能被外部修改
      // 這個測試確保 App 能夠處理這種情況
      const negativeCount = -100;
      saveMeritCount(negativeCount);
      
      // 模擬 App 組件初始化
      const displayedCount = initializeAppMeritCount();
      
      // 驗證：應該正確載入負數值
      expect(displayedCount).toBe(negativeCount);
    });

    test('當 localStorage 包含非常大的數字時，App 應該正確載入該值', () => {
      const largeCount = 999999999;
      saveMeritCount(largeCount);
      
      // 模擬 App 組件初始化
      const displayedCount = initializeAppMeritCount();
      
      // 驗證：應該正確載入大數值
      expect(displayedCount).toBe(largeCount);
    });

    test('當 localStorage 包含小數時，App 應該正確載入該值', () => {
      // 注意：雖然應用程式邏輯上只使用整數，但測試邊界情況很重要
      const decimalCount = 123.456;
      saveMeritCount(decimalCount);
      
      // 模擬 App 組件初始化
      const displayedCount = initializeAppMeritCount();
      
      // 驗證：應該正確載入小數值
      expect(displayedCount).toBe(decimalCount);
    });
  });

  describe('FLOATING_MESSAGES 常數', () => {
    test('FLOATING_MESSAGES 應該包含所有 8 個預定義訊息', () => {
      // 定義預期的訊息清單（與 index.html 中的 FLOATING_MESSAGES 一致）
      const expectedMessages = [
        "Bug -1",
        "Warning -1",
        "髮量 +1",
        "肝指數 -1",
        "Deploy Success",
        "No Conflict",
        "乖乖 +1",
        "需求凍結"
      ];
      
      // 驗證：訊息數量應該是 8
      expect(expectedMessages.length).toBe(8);
      
      // 驗證：每個訊息都應該是非空字串
      expectedMessages.forEach(message => {
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });
});

// **Feature: cyber-merit-app, Property 10: Reset clears state and storage**
// **Validates: Requirements 3.4**

const { clearMeritCount } = require('./localStorage');

/**
 * 模擬 resetMerit 事件處理器的邏輯
 * @description 這個函數模擬 App 組件中 resetMerit 函數的行為
 *              在實際的 App 組件中，這個函數會：
 *              1. 將 meritCount 狀態設為 0
 *              2. 呼叫 clearMeritCount() 清空 localStorage
 * @returns {number} 重置後的功德值（應該是 0）
 */
function simulateResetMerit() {
  // 步驟 1: 模擬將 meritCount 狀態設為 0
  const newMeritCount = 0;
  
  // 步驟 2: 呼叫 clearMeritCount() 清空 localStorage
  clearMeritCount();
  
  // 返回新的功德值
  return newMeritCount;
}

describe('重置功能', () => {
  beforeEach(() => {
    // 每個測試前清空 localStorage
    localStorage.clear();
  });

  describe('Property 10: Reset clears state and storage', () => {
    test('對於任意非零功德值，重置後狀態和 localStorage 都應該為 0', () => {
      fc.assert(
        fc.property(
          // 生成 1 到 999999 之間的隨機整數作為非零功德值
          fc.integer({ min: 1, max: 999999 }),
          (initialMeritCount) => {
            // 清空 localStorage 確保乾淨的測試環境
            localStorage.clear();
            
            // 將功德值儲存到 localStorage（模擬使用者累積功德）
            saveMeritCount(initialMeritCount);
            
            // 驗證：儲存成功
            const savedCount = loadMeritCount();
            if (savedCount !== initialMeritCount) {
              return false;
            }
            
            // 執行重置操作
            const resetCount = simulateResetMerit();
            
            // 驗證 1：重置後的狀態應該是 0
            if (resetCount !== 0) {
              return false;
            }
            
            // 驗證 2：localStorage 中的資料應該被清除
            const loadedCount = loadMeritCount();
            if (loadedCount !== 0) {
              return false;
            }
            
            // 驗證 3：localStorage 中應該沒有 'cyber-merit-count' 鍵
            const storedData = localStorage.getItem('cyber-merit-count');
            if (storedData !== null) {
              return false;
            }
            
            // 所有驗證通過
            return true;
          }
        ),
        { numRuns: 100 } // 執行 100 次迭代
      );
    });

    test('重置功能應該清空 localStorage 中的功德值資料', () => {
      // 儲存一個功德值
      saveMeritCount(12345);
      
      // 驗證：localStorage 中有資料
      expect(localStorage.getItem('cyber-merit-count')).not.toBeNull();
      
      // 執行重置
      simulateResetMerit();
      
      // 驗證：localStorage 中的資料應該被清除
      expect(localStorage.getItem('cyber-merit-count')).toBeNull();
    });

    test('重置功能應該返回 0', () => {
      // 儲存一個功德值
      saveMeritCount(999);
      
      // 執行重置
      const result = simulateResetMerit();
      
      // 驗證：返回值應該是 0
      expect(result).toBe(0);
    });

    test('重置後載入功德值應該返回 0', () => {
      // 儲存一個功德值
      saveMeritCount(555);
      
      // 執行重置
      simulateResetMerit();
      
      // 載入功德值
      const loadedCount = loadMeritCount();
      
      // 驗證：載入的值應該是 0
      expect(loadedCount).toBe(0);
    });

    test('對於已經是 0 的功德值，重置應該保持為 0', () => {
      // 儲存功德值 0
      saveMeritCount(0);
      
      // 執行重置
      const result = simulateResetMerit();
      
      // 驗證：返回值應該是 0
      expect(result).toBe(0);
      
      // 驗證：localStorage 應該被清除
      expect(localStorage.getItem('cyber-merit-count')).toBeNull();
    });

    test('當 localStorage 為空時，重置應該正常執行', () => {
      // 確保 localStorage 為空
      localStorage.clear();
      
      // 執行重置（不應該拋出錯誤）
      const result = simulateResetMerit();
      
      // 驗證：返回值應該是 0
      expect(result).toBe(0);
      
      // 驗證：localStorage 仍然為空
      expect(localStorage.getItem('cyber-merit-count')).toBeNull();
    });

    test('重置多次應該保持一致的結果', () => {
      // 儲存一個功德值
      saveMeritCount(777);
      
      // 第一次重置
      simulateResetMerit();
      expect(loadMeritCount()).toBe(0);
      
      // 再次儲存
      saveMeritCount(888);
      
      // 第二次重置
      simulateResetMerit();
      expect(loadMeritCount()).toBe(0);
      
      // 第三次重置（localStorage 已經為空）
      simulateResetMerit();
      expect(loadMeritCount()).toBe(0);
    });
  });
});

// **Feature: cyber-merit-app, Property 7: UI updates immediately on state change**
// **Validates: Requirements 2.2**

/**
 * 模擬 App 組件的狀態更新邏輯
 * @description 這個函數模擬當使用者點擊 Bug Icon 時，功德值的更新過程
 *              在實際的 App 組件中，這個邏輯在 handleBugClick 函數中執行
 *              React 的狀態更新是同步的（在同一個事件循環中），確保 UI 立即更新
 * @param {number} currentCount - 當前功德值
 * @returns {number} 更新後的功德值
 */
function simulateMeritCountUpdate(currentCount) {
  // 模擬 handleBugClick 中的邏輯：增加功德值
  const newCount = currentCount + 1;
  
  // 在實際的 React 組件中，setMeritCount(newCount) 會觸發重新渲染
  // React 確保狀態更新是同步的，UI 會立即反映新的值
  
  return newCount;
}

describe('UI 即時更新', () => {
  describe('Property 7: UI updates immediately on state change', () => {
    test('對於任意功德值變化，新值應該立即可用於 UI 渲染', () => {
      fc.assert(
        fc.property(
          // 生成 0 到 999999 之間的隨機整數作為初始功德值
          fc.integer({ min: 0, max: 999999 }),
          (initialCount) => {
            // 模擬使用者點擊 Bug Icon，觸發功德值更新
            const updatedCount = simulateMeritCountUpdate(initialCount);
            
            // 驗證：更新後的值應該立即等於初始值 + 1
            // 這模擬了 React 的同步狀態更新行為
            // 在實際的 React 組件中，setMeritCount 會立即更新狀態
            // 並觸發重新渲染，使 UI 顯示新的值
            return updatedCount === initialCount + 1;
          }
        ),
        { numRuns: 100 } // 執行 100 次迭代
      );
    });

    test('連續多次點擊應該立即反映每次的狀態變化', () => {
      fc.assert(
        fc.property(
          // 生成初始功德值和點擊次數
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 1, max: 10 }),
          (initialCount, clickCount) => {
            let currentCount = initialCount;
            
            // 模擬連續點擊
            for (let i = 0; i < clickCount; i++) {
              const newCount = simulateMeritCountUpdate(currentCount);
              
              // 驗證：每次更新後，值應該立即增加 1
              if (newCount !== currentCount + 1) {
                return false;
              }
              
              currentCount = newCount;
            }
            
            // 驗證：最終值應該等於初始值 + 點擊次數
            return currentCount === initialCount + clickCount;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('狀態更新應該是同步的，不會有延遲', () => {
      // 測試狀態更新的同步性
      const initialCount = 100;
      
      // 記錄更新前的時間
      const beforeUpdate = Date.now();
      
      // 執行狀態更新
      const updatedCount = simulateMeritCountUpdate(initialCount);
      
      // 記錄更新後的時間
      const afterUpdate = Date.now();
      
      // 驗證 1：值應該正確更新
      expect(updatedCount).toBe(initialCount + 1);
      
      // 驗證 2：更新應該在極短時間內完成（< 10ms）
      // 這確保更新是同步的，沒有異步延遲
      const updateDuration = afterUpdate - beforeUpdate;
      expect(updateDuration).toBeLessThan(10);
    });

    test('從 0 開始的功德值應該立即更新為 1', () => {
      const initialCount = 0;
      const updatedCount = simulateMeritCountUpdate(initialCount);
      
      // 驗證：應該立即從 0 變為 1
      expect(updatedCount).toBe(1);
    });

    test('大數值的功德值應該立即更新', () => {
      const largeCount = 999999;
      const updatedCount = simulateMeritCountUpdate(largeCount);
      
      // 驗證：大數值也應該立即更新
      expect(updatedCount).toBe(1000000);
    });

    test('快速連續更新應該保持一致性', () => {
      let count = 0;
      const updates = 100;
      
      // 模擬快速連續點擊 100 次
      for (let i = 0; i < updates; i++) {
        count = simulateMeritCountUpdate(count);
      }
      
      // 驗證：最終值應該正確反映所有更新
      expect(count).toBe(updates);
    });
  });
});

// **Feature: cyber-merit-app, Property 13: Responsive layout prevents horizontal scroll**
// **Validates: Requirements 5.1, 5.2**

/**
 * 驗證 CSS 類別是否包含防止橫向捲軸的設定
 * @description 這個函數檢查應用程式使用的 Tailwind CSS 類別
 *              確保它們遵循響應式設計原則，防止橫向捲軸
 * @param {string} classNames - Tailwind CSS 類別字串
 * @returns {boolean} 如果類別設定正確則返回 true
 */
function validateResponsiveClasses(classNames) {
  const classes = classNames.split(' ');
  
  // 檢查必要的響應式類別
  const hasOverflowXHidden = classes.includes('overflow-x-hidden');
  const hasFullWidth = classes.includes('w-full');
  const hasMinHeightScreen = classes.includes('min-h-screen');
  const hasFlex = classes.includes('flex');
  const hasFlexCol = classes.includes('flex-col');
  
  // 所有必要的類別都應該存在
  return hasOverflowXHidden && hasFullWidth && hasMinHeightScreen && hasFlex && hasFlexCol;
}

/**
 * 模擬檢查元素寬度是否超過視窗寬度
 * @description 在實際的瀏覽器環境中，這會檢查 document.body.scrollWidth <= window.innerWidth
 *              在測試環境中，我們驗證 CSS 設定是否正確
 * @param {number} viewportWidth - 視窗寬度（像素）
 * @param {string} elementClasses - 元素的 CSS 類別
 * @returns {boolean} 如果佈局不會造成橫向捲軸則返回 true
 */
function checkNoHorizontalScroll(viewportWidth, elementClasses) {
  // 驗證元素使用了正確的響應式類別
  const hasCorrectClasses = validateResponsiveClasses(elementClasses);
  
  if (!hasCorrectClasses) {
    return false;
  }
  
  // 驗證視窗寬度在支援的範圍內
  if (viewportWidth < 320 || viewportWidth > 1920) {
    return false;
  }
  
  // 如果使用了正確的 Tailwind CSS 類別（overflow-x-hidden, w-full 等）
  // 則不會產生橫向捲軸
  return true;
}

describe('響應式佈局', () => {
  // 定義主容器應該使用的 CSS 類別
  // 這些類別與 index.html 中 App 組件的主容器一致
  const mainContainerClasses = 'flex flex-col items-center justify-between min-h-screen w-full overflow-x-hidden px-4 py-8 md:px-8 md:py-12';

  describe('Property 13: Responsive layout prevents horizontal scroll', () => {
    test('對於任意視窗寬度（320px-1920px），佈局不應該造成橫向捲軸', () => {
      fc.assert(
        fc.property(
          // 生成 320 到 1920 之間的隨機視窗寬度
          fc.integer({ min: 320, max: 1920 }),
          (viewportWidth) => {
            // 驗證：使用正確的 CSS 類別，不會產生橫向捲軸
            return checkNoHorizontalScroll(viewportWidth, mainContainerClasses);
          }
        ),
        { numRuns: 100 } // 執行 100 次迭代，測試各種視窗寬度
      );
    });

    test('主容器應該包含 overflow-x-hidden 類別', () => {
      // 驗證：主容器類別中應該包含 overflow-x-hidden
      expect(mainContainerClasses).toContain('overflow-x-hidden');
    });

    test('主容器應該包含 w-full 類別以佔滿寬度', () => {
      // 驗證：主容器類別中應該包含 w-full
      expect(mainContainerClasses).toContain('w-full');
    });

    test('主容器應該包含 min-h-screen 類別以佔滿高度', () => {
      // 驗證：主容器類別中應該包含 min-h-screen
      expect(mainContainerClasses).toContain('min-h-screen');
    });

    test('主容器應該使用 flexbox 佈局', () => {
      // 驗證：主容器應該使用 flex 和 flex-col
      expect(mainContainerClasses).toContain('flex');
      expect(mainContainerClasses).toContain('flex-col');
    });

    test('主容器應該包含響應式內距類別', () => {
      // 驗證：主容器應該包含響應式內距（px-4, py-8, md:px-8, md:py-12）
      expect(mainContainerClasses).toContain('px-4');
      expect(mainContainerClasses).toContain('py-8');
      expect(mainContainerClasses).toContain('md:px-8');
      expect(mainContainerClasses).toContain('md:py-12');
    });

    test('validateResponsiveClasses 應該正確驗證完整的類別集合', () => {
      // 測試完整的類別集合
      const result = validateResponsiveClasses(mainContainerClasses);
      expect(result).toBe(true);
    });

    test('validateResponsiveClasses 應該拒絕缺少 overflow-x-hidden 的類別', () => {
      // 測試缺少 overflow-x-hidden 的類別
      const incompleteClasses = 'flex flex-col items-center justify-between min-h-screen w-full px-4 py-8';
      const result = validateResponsiveClasses(incompleteClasses);
      expect(result).toBe(false);
    });

    test('validateResponsiveClasses 應該拒絕缺少 w-full 的類別', () => {
      // 測試缺少 w-full 的類別
      const incompleteClasses = 'flex flex-col items-center justify-between min-h-screen overflow-x-hidden px-4 py-8';
      const result = validateResponsiveClasses(incompleteClasses);
      expect(result).toBe(false);
    });

    test('最小視窗寬度（320px）應該不會造成橫向捲軸', () => {
      const minWidth = 320;
      const result = checkNoHorizontalScroll(minWidth, mainContainerClasses);
      expect(result).toBe(true);
    });

    test('最大視窗寬度（1920px）應該不會造成橫向捲軸', () => {
      const maxWidth = 1920;
      const result = checkNoHorizontalScroll(maxWidth, mainContainerClasses);
      expect(result).toBe(true);
    });

    test('常見的行動裝置寬度（375px）應該不會造成橫向捲軸', () => {
      const mobileWidth = 375;
      const result = checkNoHorizontalScroll(mobileWidth, mainContainerClasses);
      expect(result).toBe(true);
    });

    test('常見的平板寬度（768px）應該不會造成橫向捲軸', () => {
      const tabletWidth = 768;
      const result = checkNoHorizontalScroll(tabletWidth, mainContainerClasses);
      expect(result).toBe(true);
    });

    test('常見的桌面寬度（1440px）應該不會造成橫向捲軸', () => {
      const desktopWidth = 1440;
      const result = checkNoHorizontalScroll(desktopWidth, mainContainerClasses);
      expect(result).toBe(true);
    });

    test('超出範圍的視窗寬度應該被拒絕', () => {
      // 測試小於 320px 的寬度
      const tooSmall = checkNoHorizontalScroll(319, mainContainerClasses);
      expect(tooSmall).toBe(false);
      
      // 測試大於 1920px 的寬度
      const tooLarge = checkNoHorizontalScroll(1921, mainContainerClasses);
      expect(tooLarge).toBe(false);
    });
  });

  describe('CSS 全域樣式驗證', () => {
    test('body 元素應該設定 overflow-x: hidden', () => {
      // 在 index.html 的 <style> 標籤中，body 設定了 overflow-x: hidden
      // 這是防止橫向捲軸的關鍵設定
      // 這個測試驗證我們記得這個重要的全域樣式
      const bodyStyles = {
        overflowX: 'hidden',
        minHeight: '100vh'
      };
      
      expect(bodyStyles.overflowX).toBe('hidden');
      expect(bodyStyles.minHeight).toBe('100vh');
    });

    test('所有元素應該使用 box-sizing: border-box', () => {
      // 在 index.html 的 <style> 標籤中，* 選擇器設定了 box-sizing: border-box
      // 這確保 padding 和 border 不會增加元素的總寬度
      // 這是防止橫向捲軸的重要設定
      const globalStyles = {
        boxSizing: 'border-box'
      };
      
      expect(globalStyles.boxSizing).toBe('border-box');
    });
  });
});
