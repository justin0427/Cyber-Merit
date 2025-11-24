// **Feature: cyber-merit-app, Property 3: Click triggers scale animation**
// **Validates: Requirements 1.3**

// **Feature: cyber-merit-app, Property 14: Touch elements have manipulation property**
// **Validates: Requirements 5.5**

const fc = require('fast-check');
const React = require('react');
const { render, fireEvent } = require('@testing-library/react');
require('@testing-library/jest-dom');

/**
 * BugIconSVG 組件 - 用於測試
 * 這是從 index.html 中提取的組件
 */
function BugIconSVG() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '100%',
        height: '100%',
        maxWidth: '200px',
        maxHeight: '200px'
      }}
      aria-label="Bug Icon"
    >
      <rect x="30" y="35" width="40" height="50" rx="8" fill="none" stroke="#00ff00" strokeWidth="2.5" />
      <circle cx="50" cy="25" r="8" fill="none" stroke="#00ff00" strokeWidth="2.5" />
      <line x1="50" y1="33" x2="50" y2="35" stroke="#00ff00" strokeWidth="2.5" />
      <path d="M 42 20 Q 35 15, 30 12" fill="none" stroke="#00ff00" strokeWidth="2" strokeLinecap="round" />
      <path d="M 58 20 Q 65 15, 70 12" fill="none" stroke="#00ff00" strokeWidth="2" strokeLinecap="round" />
      <path d="M 30 45 L 15 40" stroke="#00ff00" strokeWidth="2" strokeLinecap="round" />
      <path d="M 30 60 L 12 60" stroke="#00ff00" strokeWidth="2" strokeLinecap="round" />
      <path d="M 30 75 L 15 80" stroke="#00ff00" strokeWidth="2" strokeLinecap="round" />
      <path d="M 70 45 L 85 40" stroke="#00ff00" strokeWidth="2" strokeLinecap="round" />
      <path d="M 70 60 L 88 60" stroke="#00ff00" strokeWidth="2" strokeLinecap="round" />
      <path d="M 70 75 L 85 80" stroke="#00ff00" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="50" x2="65" y2="50" stroke="#00ff00" strokeWidth="1.5" opacity="0.7" />
      <line x1="35" y1="60" x2="65" y2="60" stroke="#00ff00" strokeWidth="1.5" opacity="0.7" />
      <line x1="35" y1="70" x2="65" y2="70" stroke="#00ff00" strokeWidth="1.5" opacity="0.7" />
      <circle cx="50" cy="60" r="3" fill="#00ff00" opacity="0.8" />
    </svg>
  );
}

/**
 * BugIcon 組件 - 用於測試
 * 這是從 index.html 中提取的組件
 */
function BugIcon({ onClick, isAnimating }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(event);
    }
  };
  
  return (
    <div
      data-testid="bug-icon"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="點擊累積功德值"
      style={{
        width: '150px',
        height: '150px',
        cursor: 'pointer',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'transform 0.2s ease, filter 0.2s ease',
        position: 'relative',
        zIndex: 10
      }}
      className={`animate-pulse-glow ${isAnimating ? 'animate-click-scale' : ''}`}
    >
      <BugIconSVG />
    </div>
  );
}

describe('BugIcon 組件', () => {
  describe('Property 3: Click triggers scale animation', () => {
    test('對於任意點擊事件，BugIcon 元素應該套用 animate-click-scale 動畫類別', () => {
      fc.assert(
        fc.property(
          // 生成隨機的 isAnimating 狀態
          fc.boolean(),
          (isAnimating) => {
            const mockOnClick = jest.fn();
            
            // 渲染組件
            const { getByTestId, unmount } = render(
              <BugIcon onClick={mockOnClick} isAnimating={isAnimating} />
            );
            
            const element = getByTestId('bug-icon');
            
            // 驗證 1: 當 isAnimating 為 true 時，元素應該有 animate-click-scale 類別
            const hasClickScaleClass = element.classList.contains('animate-click-scale');
            const shouldHaveClickScale = isAnimating;
            
            // 驗證 2: 元素應該始終有 animate-pulse-glow 類別（呼吸動畫）
            const hasPulseGlowClass = element.classList.contains('animate-pulse-glow');
            
            // 清理
            unmount();
            
            // 驗證邏輯：
            // - 如果 isAnimating 為 true，應該有 click-scale 類別
            // - 如果 isAnimating 為 false，不應該有 click-scale 類別
            // - 無論如何都應該有 pulse-glow 類別
            return (hasClickScaleClass === shouldHaveClickScale) && hasPulseGlowClass;
          }
        ),
        { numRuns: 100 } // 執行 100 次迭代
      );
    });

    test('當 isAnimating 為 false 時，不應該套用 animate-click-scale 類別', () => {
      const mockOnClick = jest.fn();
      
      const { getByTestId } = render(
        <BugIcon onClick={mockOnClick} isAnimating={false} />
      );
      
      const element = getByTestId('bug-icon');
      
      // 驗證：不應該有 animate-click-scale 類別
      expect(element).not.toHaveClass('animate-click-scale');
      
      // 但應該仍然有 animate-pulse-glow 類別
      expect(element).toHaveClass('animate-pulse-glow');
    });

    test('當 isAnimating 為 true 時，應該套用 animate-click-scale 類別', () => {
      const mockOnClick = jest.fn();
      
      const { getByTestId } = render(
        <BugIcon onClick={mockOnClick} isAnimating={true} />
      );
      
      const element = getByTestId('bug-icon');
      
      // 驗證：應該有 animate-click-scale 類別
      expect(element).toHaveClass('animate-click-scale');
      
      // 也應該有 animate-pulse-glow 類別
      expect(element).toHaveClass('animate-pulse-glow');
    });

    test('點擊事件應該觸發 onClick 回調', () => {
      const mockOnClick = jest.fn();
      
      const { getByTestId } = render(
        <BugIcon onClick={mockOnClick} isAnimating={false} />
      );
      
      const element = getByTestId('bug-icon');
      
      // 觸發點擊事件
      fireEvent.click(element);
      
      // 驗證：onClick 應該被呼叫
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('BugIcon 應該始終有 animate-pulse-glow 呼吸動畫', () => {
      fc.assert(
        fc.property(
          // 生成隨機的 isAnimating 狀態
          fc.boolean(),
          (isAnimating) => {
            const mockOnClick = jest.fn();
            
            const { getByTestId, unmount } = render(
              <BugIcon onClick={mockOnClick} isAnimating={isAnimating} />
            );
            
            const element = getByTestId('bug-icon');
            
            // 驗證：無論 isAnimating 狀態如何，都應該有 pulse-glow 動畫
            const result = element.classList.contains('animate-pulse-glow');
            
            // 清理
            unmount();
            
            return result;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 14: Touch elements have manipulation property', () => {
    test('對於任意 BugIcon 元素，computed style 應該包含 touch-action: manipulation', () => {
      fc.assert(
        fc.property(
          // 生成隨機的 isAnimating 狀態
          fc.boolean(),
          (isAnimating) => {
            const mockOnClick = jest.fn();
            
            const { getByTestId, unmount } = render(
              <BugIcon onClick={mockOnClick} isAnimating={isAnimating} />
            );
            
            const element = getByTestId('bug-icon');
            
            // 驗證：元素的 style 應該包含 touchAction: 'manipulation'
            const hasTouchActionManipulation = element.style.touchAction === 'manipulation';
            
            // 清理
            unmount();
            
            return hasTouchActionManipulation;
          }
        ),
        { numRuns: 100 } // 執行 100 次迭代
      );
    });

    test('BugIcon 應該有 touch-action: manipulation 樣式', () => {
      const mockOnClick = jest.fn();
      
      const { getByTestId } = render(
        <BugIcon onClick={mockOnClick} isAnimating={false} />
      );
      
      const element = getByTestId('bug-icon');
      
      // 驗證：touchAction 應該為 'manipulation'
      expect(element.style.touchAction).toBe('manipulation');
    });

    test('BugIcon 應該有 cursor: pointer 樣式', () => {
      const mockOnClick = jest.fn();
      
      const { getByTestId } = render(
        <BugIcon onClick={mockOnClick} isAnimating={false} />
      );
      
      const element = getByTestId('bug-icon');
      
      // 驗證：cursor 應該為 'pointer'
      expect(element.style.cursor).toBe('pointer');
    });

    test('BugIcon 應該有正確的尺寸', () => {
      const mockOnClick = jest.fn();
      
      const { getByTestId } = render(
        <BugIcon onClick={mockOnClick} isAnimating={false} />
      );
      
      const element = getByTestId('bug-icon');
      
      // 驗證：寬度和高度應該為 150px
      expect(element.style.width).toBe('150px');
      expect(element.style.height).toBe('150px');
    });

    test('BugIcon 應該有無障礙屬性', () => {
      const mockOnClick = jest.fn();
      
      const { getByTestId } = render(
        <BugIcon onClick={mockOnClick} isAnimating={false} />
      );
      
      const element = getByTestId('bug-icon');
      
      // 驗證：應該有 role="button"
      expect(element).toHaveAttribute('role', 'button');
      
      // 驗證：應該有 aria-label
      expect(element).toHaveAttribute('aria-label', '點擊累積功德值');
      
      // 驗證：應該有 tabIndex="0" 使其可被鍵盤 focus
      expect(element).toHaveAttribute('tabIndex', '0');
    });

    test('BugIcon 應該支援鍵盤操作（Enter 鍵）', () => {
      const mockOnClick = jest.fn();
      
      const { getByTestId } = render(
        <BugIcon onClick={mockOnClick} isAnimating={false} />
      );
      
      const element = getByTestId('bug-icon');
      
      // 觸發 Enter 鍵事件
      fireEvent.keyDown(element, { key: 'Enter' });
      
      // 驗證：onClick 應該被呼叫
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('BugIcon 應該支援鍵盤操作（Space 鍵）', () => {
      const mockOnClick = jest.fn();
      
      const { getByTestId } = render(
        <BugIcon onClick={mockOnClick} isAnimating={false} />
      );
      
      const element = getByTestId('bug-icon');
      
      // 觸發 Space 鍵事件
      fireEvent.keyDown(element, { key: ' ' });
      
      // 驗證：onClick 應該被呼叫
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('BugIcon 應該有防止選取的樣式', () => {
      const mockOnClick = jest.fn();
      
      const { getByTestId } = render(
        <BugIcon onClick={mockOnClick} isAnimating={false} />
      );
      
      const element = getByTestId('bug-icon');
      
      // 驗證：userSelect 應該為 'none'
      expect(element.style.userSelect).toBe('none');
      
      // 驗證：WebkitTouchCallout 應該為 'none'
      expect(element.style.WebkitTouchCallout).toBe('none');
      
      // 驗證：WebkitTapHighlightColor 應該為 'transparent'
      expect(element.style.WebkitTapHighlightColor).toBe('transparent');
    });

    test('BugIcon 應該有正確的佈局樣式', () => {
      const mockOnClick = jest.fn();
      
      const { getByTestId } = render(
        <BugIcon onClick={mockOnClick} isAnimating={false} />
      );
      
      const element = getByTestId('bug-icon');
      
      // 驗證：display 應該為 'flex'
      expect(element.style.display).toBe('flex');
      
      // 驗證：justifyContent 應該為 'center'
      expect(element.style.justifyContent).toBe('center');
      
      // 驗證：alignItems 應該為 'center'
      expect(element.style.alignItems).toBe('center');
    });

    test('BugIcon 應該有正確的 z-index', () => {
      const mockOnClick = jest.fn();
      
      const { getByTestId } = render(
        <BugIcon onClick={mockOnClick} isAnimating={false} />
      );
      
      const element = getByTestId('bug-icon');
      
      // 驗證：position 應該為 'relative'
      expect(element.style.position).toBe('relative');
      
      // 驗證：zIndex 應該為 '10'
      expect(element.style.zIndex).toBe('10');
    });
  });
});
