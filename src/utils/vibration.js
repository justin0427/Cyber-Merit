/**
 * 觸發裝置震動
 * @description 在支援震動 API 的裝置上觸發短暫震動回饋
 *              震動持續時間：10 毫秒
 *              用於增強使用者點擊 Bug Icon 時的觸覺回饋
 *              如果裝置不支援震動 API，函數將靜默跳過
 * @requirements 1.4, 8.2
 */
function triggerVibration() {
  // 檢查瀏覽器是否支援 Vibration API
  // navigator.vibrate 在大多數現代行動裝置瀏覽器中可用
  // 桌面瀏覽器通常不支援此 API
  // 在測試環境中使用 global.navigator，在瀏覽器中使用 navigator
  const nav = typeof navigator !== 'undefined' ? navigator : (typeof global !== 'undefined' ? global.navigator : undefined);
  
  if (nav && nav.vibrate) {
    // 觸發 10 毫秒的震動
    // 參數可以是單一數字（震動持續時間）或陣列（震動模式）
    // 10ms 提供輕微的觸覺回饋，不會過於干擾使用者
    nav.vibrate(10);
  }
  // 如果不支援震動 API，靜默跳過
  // 這是漸進式增強 (Progressive Enhancement) 的實踐
  // 應用程式在不支援震動的裝置上仍能正常運作
}

module.exports = { triggerVibration };
