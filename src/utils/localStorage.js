// ==================== LocalStorage 管理工具函數 ====================

/**
 * 儲存功德值到 LocalStorage
 * @param {number} count - 要儲存的功德值
 * @description 將功德值和最後更新時間儲存到瀏覽器的 LocalStorage 中
 *              包含完整的錯誤處理，確保即使儲存失敗應用程式仍能繼續運作
 */
function saveMeritCount(count) {
  try {
    // 建立包含功德值和時間戳記的資料物件
    const meritData = {
      count: count,
      lastUpdated: new Date().toISOString()
    };
    
    // 將資料物件轉換為 JSON 字串並儲存到 LocalStorage
    localStorage.setItem('cyber-merit-count', JSON.stringify(meritData));
  } catch (error) {
    // 如果儲存失敗（例如：LocalStorage 已滿或被禁用），記錄警告但不中斷應用程式
    console.warn('無法儲存功德值到 LocalStorage:', error);
    // 應用程式將繼續在記憶體中運作，但資料不會持久化
  }
}

/**
 * 從 LocalStorage 載入功德值
 * @returns {number} 儲存的功德值，如果不存在則返回 0
 * @description 從 LocalStorage 讀取功德值，處理各種邊界情況
 *              包括：空值、無效 JSON、LocalStorage 不可用等
 */
function loadMeritCount() {
  try {
    // 從 LocalStorage 讀取資料
    const storedData = localStorage.getItem('cyber-merit-count');
    
    // 如果沒有儲存的資料，返回初始值 0
    if (!storedData) {
      return 0;
    }
    
    // 解析 JSON 字串為物件
    const meritData = JSON.parse(storedData);
    
    // 返回功德值，如果解析失敗或資料格式不正確，返回 0
    return typeof meritData.count === 'number' ? meritData.count : 0;
  } catch (error) {
    // 如果讀取或解析失敗，記錄警告並返回初始值 0
    console.warn('無法從 LocalStorage 載入功德值:', error);
    return 0;
  }
}

/**
 * 清空 LocalStorage 中的功德值
 * @description 從 LocalStorage 中移除功德值資料，用於重置功能
 *              包含錯誤處理以確保操作安全
 */
function clearMeritCount() {
  try {
    // 從 LocalStorage 中移除功德值資料
    localStorage.removeItem('cyber-merit-count');
  } catch (error) {
    // 如果清除失敗，記錄警告
    console.warn('無法清除 LocalStorage 中的功德值:', error);
  }
}

module.exports = {
  saveMeritCount,
  loadMeritCount,
  clearMeritCount
};
