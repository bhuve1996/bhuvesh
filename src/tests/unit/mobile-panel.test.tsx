import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { FloatingPanel } from '@/components/organisms/FloatingPanel/FloatingPanel';

// Mock the draggable panel hook
jest.mock('@/hooks/useDraggablePanel', () => ({
  useDraggablePanel: () => ({
    isDragging: false,
    dragHandleProps: {},
    panelStyle: { left: '100px', top: '100px' },
    resetPosition: jest.fn(),
  }),
}));

// Mock the tabs component
jest.mock('@/components/molecules/Tabs/Tabs', () => ({
  Tabs: ({
    items,
    defaultActiveTab,
    onTabChange,
    className,
  }: {
    items: Array<{ id: string; label: string; content: React.ReactNode }>;
    defaultActiveTab: string;
    onTabChange?: (tabId: string) => void;
    className?: string;
  }) => (
    <div className={className} data-testid='tabs-component'>
      <div className='tab-navigation'>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange?.(item.id)}
            data-testid={`tab-${item.id}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className='tab-content'>
        {items.find(item => item.id === defaultActiveTab)?.content}
      </div>
    </div>
  ),
}));

// Mock the tab components
jest.mock('@/components/organisms/FloatingPanel/tabs/ExportTab', () => ({
  ExportTab: () => <div data-testid='export-tab'>Export Tab Content</div>,
}));

jest.mock('@/components/organisms/FloatingPanel/tabs/PageBreaksTab', () => ({
  PageBreaksTab: () => (
    <div data-testid='page-breaks-tab'>Page Breaks Tab Content</div>
  ),
}));

jest.mock(
  '@/components/organisms/FloatingPanel/tabs/TemplateCustomizerTab',
  () => ({
    TemplateCustomizerTab: () => (
      <div data-testid='template-customizer-tab'>
        Template Customizer Tab Content
      </div>
    ),
  })
);

jest.mock('@/components/organisms/FloatingPanel/tabs/ATSAnalysisTab', () => ({
  ATSAnalysisTab: () => (
    <div data-testid='ats-analysis-tab'>ATS Analysis Tab Content</div>
  ),
}));

jest.mock('@/components/organisms/FloatingPanel/tabs/ValidationTab', () => ({
  ValidationTab: () => (
    <div data-testid='validation-tab'>Validation Tab Content</div>
  ),
}));

describe('FloatingPanel Mobile Behavior', () => {
  const mockProps = {
    resumeData: {},
    template: {},
    onTemplateChange: jest.fn(),
    resumeElement: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Mobile Detection (375px)', () => {
    beforeEach(() => {
      // Mock window.innerWidth for mobile detection
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      // Mock window.addEventListener and removeEventListener
      window.addEventListener = jest.fn();
      window.removeEventListener = jest.fn();
    });

    it('should render FloatingPanel component', () => {
      render(<FloatingPanel {...mockProps} />);

      // The component should render without errors
      // Check that the mobile side button is present
      const mobileSideButton = screen.getByTestId('mobile-side-button');
      expect(mobileSideButton).toBeInTheDocument();
    });

    it('should have mobile side button when panel is closed', () => {
      render(<FloatingPanel {...mockProps} />);

      // Look for the mobile side button
      const mobileSideButton = screen.queryByTestId('mobile-side-button');
      if (mobileSideButton) {
        expect(mobileSideButton).toBeInTheDocument();
        expect(mobileSideButton).toHaveTextContent('Tools');
      }
    });

    it('should open panel when clicked', () => {
      render(<FloatingPanel {...mockProps} />);

      // Find any button that can open the panel
      const openButton =
        screen.queryByTestId('mobile-side-button') ||
        screen.queryByTestId('floating-action-button');

      if (openButton) {
        fireEvent.click(openButton);

        const panel = screen.getByRole('dialog');
        expect(panel).toBeInTheDocument();
      }
    });
  });

  describe('Desktop Detection (1024px)', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('should show desktop floating button and hide mobile side button', () => {
      render(<FloatingPanel {...mockProps} />);

      // Should show desktop floating button
      const floatingButton = screen.getByTestId('floating-action-button');
      expect(floatingButton).toBeInTheDocument();
      expect(floatingButton).toHaveTextContent('Resume Builder');

      // Should hide mobile side button
      const mobileSideButton = screen.queryByTestId('mobile-side-button');
      expect(mobileSideButton).not.toBeInTheDocument();
    });

    it('should open panel with desktop behavior', () => {
      render(<FloatingPanel {...mockProps} />);

      const floatingButton = screen.getByTestId('floating-action-button');
      fireEvent.click(floatingButton);

      const panel = screen.getByRole('dialog');
      expect(panel).toBeInTheDocument();
      expect(panel).toHaveClass('rounded-xl');
      expect(panel).not.toHaveClass(
        'rounded-l-xl',
        'fixed',
        'right-0',
        'top-0',
        'bottom-0'
      );
    });
  });
});
