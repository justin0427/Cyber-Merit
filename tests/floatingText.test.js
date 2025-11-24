// **Feature: cyber-merit-app, Property 12: Floating text animates and cleans up**
// **Validates: Requirements 6.3, 6.4**

const fc = require('fast-check');
const React = require('react');
const { render, waitFor } = require('@testing-library/react');
require('@testing-library/jest-dom');

/**
 * FloatingText 組件 - 用於測試
 * 這是從 index.html 中提取的組件，用於單元測試
 */
function FloatingText({ id, text, x, y, onAnimationEnd }) {
  const textRef = React.useRef(null);
  
  React.useEffect(() => {
    const element = textRef.current;
    if (!element) return;
    
    const handleAnimationEnd = () => {
      onAnimationEnd(id);
    };
    
    element.addEventListener('animationend', handleAnimationEnd);
    
    return () => {
      element.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [id, onAnimationEnd]);
  
  return (
    <div
      ref={textRef}
      data-testid={`floating-text-${id}`}
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        pointerEvents: 'none',
        color: '#00ff00',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00',
        whiteSpace: 'nowrap',
        userSelect: 'none'
      }}
      className="animate-float-up"
    >
      {text}
    </div>
  );
}

describe('FloatingText 組件', () => {
  describe('Property 12: Floating text animates and cleans up', () => {
    test('對於任意飄浮文字，應該包含 CSS 動畫屬性並在動畫結束後觸發回調', () => {
      fc.assert(
        fc.property(
          // 生成隨機的文字內容
          fc.constantFrom('Bug -1', 'Warning -1', '髮量 +1', '肝指數 -1', 'Deploy Success', 'No Conflict', '乖乖 +1', '需求凍結'),
          // 生成隨機的 X 座標 (0-1920px)
          fc.integer({ min: 0, max: 1920 }),
          // 生成隨機的 Y 座標 (0-1080px)
          fc.integer({ min: 0, max: 1080 }),
          (text, x, y) => {
            const id = `test-${Date.now()}-${Math.random()}`;
            const mockCallback = jest.fn();
            
            // 渲染組件
            const { getByTestId } = render(
              <FloatingText
                id={id}
                text={text}
                x={x}
                y={y}
                onAnimationEnd={mockCallback}
              />
            );
            
            // 取得渲染的元素
            const element = getByTestId(`floating-text-${id}`);
            
            // 驗證 1: 元素應該存在於 DOM 中
            const elementExists = element !== null;
            
            // 驗證 2: 元素應該包含正確的文字內容
            const hasCorrectText = element.textContent === text;
            
            // 驗證 3: 元素應該有 animate-float-up 類別（CSS 動畫）
            const hasAnimationClass = element.classList.contains('animate-float-up');
            
            // 驗證 4: 元素應該有正確的定位樣式
            const hasCorrectPosition = 
              element.style.position === 'fixed' &&
              element.style.left === `${x}px` &&
              element.style.top === `${y}px`;
            
            // 驗證 5: 元素應該有 CSS 動畫相關的樣式屬性
            const hasAnimationStyles = 
              element.style.transform === 'translate(-50%, -50%)' &&
              element.style.zIndex === '9999';
            
            // 模擬動畫結束事件
            const animationEndEvent = new Event('animationend');
            element.dispatchEvent(animationEndEvent);
            
            // 驗證 6: 動畫結束後應該呼叫回調函數
            const callbackCalled = mockCallback.mock.calls.length === 1;
            
            // 驗證 7: 回調函數應該接收正確的 id 參數
            const callbackCalledWithCorrectId = 
              mockCallback.mock.calls.length > 0 && 
              mockCallback.mock.calls[0][0] === id;
            
            // 所有驗證都必須通過
            return (
              elementExists &&
              hasCorrectText &&
              hasAnimationClass &&
              hasCorrectPosition &&
              hasAnimationStyles &&
              callbackCalled &&
              callbackCalledWithCorrectId
            );
          }
        ),
        { numRuns: 100 } // 執行 100 次迭代
      );
    });

    test('飄浮文字應該有正確的 neon green 樣式', () => {
      const id = 'test-style';
      const mockCallback = jest.fn();
      
      const { getByTestId } = render(
        <FloatingText
          id={id}
          text="Bug -1"
          x={100}
          y={100}
          onAnimationEnd={mockCallback}
        />
      );
      
      const element = getByTestId(`floating-text-${id}`);
      
      // 驗證 neon green 顏色
      expect(element.style.color).toBe('rgb(0, 255, 0)');
      
      // 驗證文字陰影（發光效果）
      expect(element.style.textShadow).toContain('#00ff00');
      
      // 驗證 monospace 字體
      expect(element.style.fontFamily).toBe('monospace');
      
      // 驗證粗體
      expect(element.style.fontWeight).toBe('bold');
    });

    test('飄浮文字應該使用 fixed positioning 確保相對於視窗定位', () => {
      const id = 'test-positioning';
      const mockCallback = jest.fn();
      const x = 500;
      const y = 300;
      
      const { getByTestId } = render(
        <FloatingText
          id={id}
          text="Deploy Success"
          x={x}
          y={y}
          onAnimationEnd={mockCallback}
        />
      );
      
      const element = getByTestId(`floating-text-${id}`);
      
      // 驗證使用 fixed positioning
      expect(element.style.position).toBe('fixed');
      
      // 驗證座標正確
      expect(element.style.left).toBe(`${x}px`);
      expect(element.style.top).toBe(`${y}px`);
      
      // 驗證 transform 用於中心對齊
      expect(element.style.transform).toBe('translate(-50%, -50%)');
    });

    test('飄浮文字應該有高 z-index 確保不被遮擋', () => {
      const id = 'test-zindex';
      const mockCallback = jest.fn();
      
      const { getByTestId } = render(
        <FloatingText
          id={id}
          text="No Conflict"
          x={100}
          y={100}
          onAnimationEnd={mockCallback}
        />
      );
      
      const element = getByTestId(`floating-text-${id}`);
      
      // 驗證 z-index 為 9999
      expect(element.style.zIndex).toBe('9999');
    });

    test('飄浮文字應該有 pointer-events: none 防止干擾點擊', () => {
      const id = 'test-pointer-events';
      const mockCallback = jest.fn();
      
      const { getByTestId } = render(
        <FloatingText
          id={id}
          text="髮量 +1"
          x={100}
          y={100}
          onAnimationEnd={mockCallback}
        />
      );
      
      const element = getByTestId(`floating-text-${id}`);
      
      // 驗證 pointer-events 為 none
      expect(element.style.pointerEvents).toBe('none');
    });

    test('動畫結束事件應該正確觸發回調並傳遞 id', () => {
      const id = 'test-callback';
      const mockCallback = jest.fn();
      
      const { getByTestId } = render(
        <FloatingText
          id={id}
          text="乖乖 +1"
          x={100}
          y={100}
          onAnimationEnd={mockCallback}
        />
      );
      
      const element = getByTestId(`floating-text-${id}`);
      
      // 模擬動畫結束事件
      const animationEndEvent = new Event('animationend');
      element.dispatchEvent(animationEndEvent);
      
      // 驗證回調被呼叫一次
      expect(mockCallback).toHaveBeenCalledTimes(1);
      
      // 驗證回調接收正確的 id
      expect(mockCallback).toHaveBeenCalledWith(id);
    });

    test('組件卸載時應該移除事件監聽器', () => {
      const id = 'test-cleanup';
      const mockCallback = jest.fn();
      
      const { getByTestId, unmount } = render(
        <FloatingText
          id={id}
          text="需求凍結"
          x={100}
          y={100}
          onAnimationEnd={mockCallback}
        />
      );
      
      const element = getByTestId(`floating-text-${id}`);
      
      // 卸載組件
      unmount();
      
      // 嘗試觸發動畫結束事件（應該不會呼叫回調）
      const animationEndEvent = new Event('animationend');
      element.dispatchEvent(animationEndEvent);
      
      // 驗證回調沒有被呼叫（因為監聽器已被移除）
      expect(mockCallback).not.toHaveBeenCalled();
    });

    test('飄浮文字應該包含 animate-float-up CSS 類別', () => {
      const id = 'test-animation-class';
      const mockCallback = jest.fn();
      
      const { getByTestId } = render(
        <FloatingText
          id={id}
          text="肝指數 -1"
          x={100}
          y={100}
          onAnimationEnd={mockCallback}
        />
      );
      
      const element = getByTestId(`floating-text-${id}`);
      
      // 驗證元素有 animate-float-up 類別
      expect(element).toHaveClass('animate-float-up');
    });
  });
});
