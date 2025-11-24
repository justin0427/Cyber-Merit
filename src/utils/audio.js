// ==================== Web Audio API 音效合成函數 ====================

/**
 * 播放功德音效
 * @description 使用 Web Audio API 合成電子音效，當使用者點擊 Bug Icon 時播放
 *              音效特性：正弦波、800Hz 頻率、100ms 持續時間、30% 音量
 *              包含完整的瀏覽器相容性檢查和錯誤處理
 * @requirements 1.5, 7.5, 8.2
 */
function playMeritSound() {
  // 瀏覽器相容性檢查 - 檢查 AudioContext 是否可用
  // 支援標準的 AudioContext 和 WebKit 前綴版本（用於舊版 Safari）
  if (!window.AudioContext && !window.webkitAudioContext) {
    // 如果瀏覽器不支援 Web Audio API，靜默跳過
    // 應用程式將繼續運作，只是沒有音效
    return;
  }
  
  try {
    // 建立 AudioContext 實例 - 音訊處理的核心物件
    // 使用相容性寫法支援不同瀏覽器
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // 建立 OscillatorNode - 用於產生週期性波形的音訊源
    const oscillator = audioContext.createOscillator();
    
    // 建立 GainNode - 用於控制音量
    const gainNode = audioContext.createGain();
    
    // 設定振盪器類型為正弦波 (sine wave)
    // 正弦波產生純淨、平滑的電子音效，適合賽博龐克風格
    oscillator.type = 'sine';
    
    // 設定頻率為 800Hz - 高頻電子音，清脆明亮
    // 頻率越高，音調越高
    oscillator.frequency.value = 800;
    
    // 設定音量為 0.3 (30%) - 避免音效過於刺耳
    // 音量範圍：0.0 (靜音) 到 1.0 (最大音量)
    gainNode.gain.value = 0.3;
    
    // 連接音訊節點：Oscillator → Gain → Destination (揚聲器)
    // 這建立了音訊處理鏈：產生音訊 → 調整音量 → 輸出到揚聲器
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 立即開始播放音效
    oscillator.start(audioContext.currentTime);
    
    // 在 100 毫秒 (0.1 秒) 後停止播放
    // 短促的音效提供即時回饋，不會干擾使用者體驗
    oscillator.stop(audioContext.currentTime + 0.1);
    
    // 音效播放完畢後清理資源
    // 在停止時間後關閉 AudioContext，釋放系統資源
    oscillator.onended = () => {
      audioContext.close();
    };
    
  } catch (error) {
    // 如果音效播放失敗（例如：瀏覽器政策限制、權限問題），記錄警告
    // 應用程式將繼續運作，不會因為音效失敗而中斷
    console.warn('音效播放失敗:', error);
  }
}

module.exports = {
  playMeritSound
};
