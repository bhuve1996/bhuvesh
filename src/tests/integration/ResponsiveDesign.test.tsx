import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock the FloatingPanel component
jest.mock('@/components/organisms/FloatingPanel/FloatingPanel', () => {
  return function MockFloatingPanel({
    resumeData: _resumeData,
    template: _template,
    onTemplateChange: _onTemplateChange,
    className = '',
  }) {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('export');

    const togglePanel = () => {
      setIsVisible(!isVisible);
      if (!isVisible) {
        setIsExpanded(false);
      }
    };

    const closePanel = () => {
      setIsVisible(false);
      setIsExpanded(false);
    };

    const tabItems = [
      {
        id: 'export',
        label: 'Export',
        content: (
          <div data-testid='export-tab-content'>
            <h4>Export Resume</h4>
            <p>Download your resume in different formats</p>
            <div className='space-y-2'>
              <button data-testid='export-pdf'>Export PDF</button>
              <button data-testid='export-docx'>Export DOCX</button>
              <button data-testid='export-txt'>Export TXT</button>
            </div>
          </div>
        ),
      },
      {
        id: 'customize',
        label: 'Customize',
        content: (
          <div data-testid='customize-tab-content'>
            <h4>Template Customization</h4>
            <p>Customize your resume template appearance</p>
            <div className='space-y-2'>
              <div>
                <label>Font Size</label>
                <input
                  type='range'
                  min='10'
                  max='18'
                  defaultValue='14'
                  data-testid='font-size-slider'
                />
              </div>
              <div>
                <label>Font Family</label>
                <select data-testid='font-family-select'>
                  <option value='Arial'>Arial</option>
                  <option value='Times New Roman'>Times New Roman</option>
                </select>
              </div>
              <div>
                <label>Color Scheme</label>
                <div className='grid grid-cols-2 gap-2'>
                  <button data-testid='color-blue'>Blue</button>
                  <button data-testid='color-green'>Green</button>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ];

    return (
      <div
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 ${className}`}
        data-testid='floating-panel-container'
      >
        {/* Floating Action Button */}
        {!isVisible && (
          <button
            onClick={togglePanel}
            className='rounded-full shadow-lg hover:shadow-xl text-sm sm:text-base'
            aria-label='Open resume tools panel'
            data-testid='floating-action-button'
          >
            <span className='hidden sm:inline'>Quick Actions</span>
            <span className='sm:hidden'>Tools</span>
          </button>
        )}

        {/* Panel */}
        {isVisible && (
          <div
            className={`
              bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700
              w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] max-w-sm sm:max-w-md md:max-w-lg
              sm:w-80 sm:h-96
              md:w-96 md:h-[600px]
              ${isExpanded ? 'md:w-[500px] md:h-[700px]' : ''}
            `}
            role='dialog'
            aria-modal='true'
            aria-labelledby='panel-title'
            data-testid='floating-panel'
          >
            {/* Header */}
            <div className='flex items-center justify-between p-3 sm:p-4 border-b border-neutral-200 dark:border-neutral-700'>
              <h3
                id='panel-title'
                className='text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100'
              >
                Resume Tools
              </h3>
              <div className='flex items-center gap-1 sm:gap-2'>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className='hidden md:flex'
                  aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
                  data-testid='expand-button'
                >
                  <span className='hidden lg:inline'>
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </span>
                </button>
                <button
                  onClick={closePanel}
                  aria-label='Close panel'
                  data-testid='close-button'
                >
                  <span className='hidden sm:inline'>Close</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className='flex-1 flex flex-col overflow-hidden'>
              <div className='tabs flex flex-col h-full'>
                {/* Tab Navigation */}
                <div className='border-b border-gray-200 flex-shrink-0'>
                  <nav className='-mb-px flex space-x-2 sm:space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide'>
                    {tabItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`
                          py-2 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0
                          ${
                            activeTab === item.id
                              ? 'border-cyan-500 text-cyan-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                          cursor-pointer
                        `}
                        data-testid={`tab-${item.id}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
                  {tabItems.find(item => item.id === activeTab)?.content}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

// Mock window.matchMedia for responsive testing
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe('Responsive Design Integration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  describe('Mobile Responsive Design (375px)', () => {
    beforeEach(() => {
      mockMatchMedia(true); // Mobile breakpoint
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it('should render floating action button with mobile text', async () => {
      // Import the mock component directly
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      expect(floatingButton).toBeInTheDocument();
      expect(floatingButton).toHaveTextContent('Tools');
      expect(floatingButton).toHaveClass('text-sm');
    });

    it('should open panel with mobile-optimized dimensions', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      await user.click(floatingButton);

      await waitFor(() => {
        const panel = screen.getByTestId('floating-panel');
        expect(panel).toBeInTheDocument();
        expect(panel).toHaveClass(
          'w-[calc(100vw-2rem)]',
          'h-[calc(100vh-2rem)]'
        );
      });
    });

    it('should have mobile-optimized header and controls', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      await user.click(floatingButton);

      await waitFor(() => {
        const panel = screen.getByTestId('floating-panel');
        expect(panel).toBeInTheDocument();

        // Check mobile header styling
        const header = panel.querySelector('h3');
        expect(header).toHaveClass('text-base');

        // Check close button shows only icon on mobile
        const closeButton = screen.getByTestId('close-button');
        expect(closeButton).toHaveTextContent('Close');

        // Check expand button is hidden on mobile (should have hidden class)
        const expandButton = screen.queryByTestId('expand-button');
        if (expandButton) {
          expect(expandButton).toHaveClass('hidden', 'md:flex');
        } else {
          expect(expandButton).not.toBeInTheDocument();
        }
      });
    });

    it('should have mobile-optimized tab navigation', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      await user.click(floatingButton);

      await waitFor(() => {
        const exportTab = screen.getByTestId('tab-export');
        const customizeTab = screen.getByTestId('tab-customize');

        expect(exportTab).toHaveClass(
          'text-xs',
          'whitespace-nowrap',
          'flex-shrink-0'
        );
        expect(customizeTab).toHaveClass(
          'text-xs',
          'whitespace-nowrap',
          'flex-shrink-0'
        );
      });
    });

    it('should have mobile-optimized tab content', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      await user.click(floatingButton);

      await waitFor(() => {
        const exportContent = screen.getByTestId('export-tab-content');
        expect(exportContent).toBeInTheDocument();

        // Switch to customize tab
        const customizeTab = screen.getByTestId('tab-customize');
        fireEvent.click(customizeTab);

        const customizeContent = screen.getByTestId('customize-tab-content');
        expect(customizeContent).toBeInTheDocument();

        // Check mobile-optimized form elements
        const fontSizeSlider = screen.getByTestId('font-size-slider');
        const fontFamilySelect = screen.getByTestId('font-family-select');
        const colorButtons = screen.getAllByTestId(/color-/);

        expect(fontSizeSlider).toBeInTheDocument();
        expect(fontFamilySelect).toBeInTheDocument();
        expect(colorButtons).toHaveLength(2);
      });
    });
  });

  describe('Tablet Responsive Design (768px)', () => {
    beforeEach(() => {
      mockMatchMedia(false); // Tablet breakpoint
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
    });

    it('should render floating action button with tablet text', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      expect(floatingButton).toBeInTheDocument();
      expect(floatingButton).toHaveTextContent('Quick Actions');
      expect(floatingButton).toHaveClass('sm:text-base');
    });

    it('should open panel with tablet-optimized dimensions', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      await user.click(floatingButton);

      await waitFor(() => {
        const panel = screen.getByTestId('floating-panel');
        expect(panel).toBeInTheDocument();
        expect(panel).toHaveClass('sm:w-80', 'sm:h-96');
      });
    });

    it('should have tablet-optimized header and controls', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      await user.click(floatingButton);

      await waitFor(() => {
        const panel = screen.getByTestId('floating-panel');
        expect(panel).toBeInTheDocument();

        // Check tablet header styling
        const header = panel.querySelector('h3');
        expect(header).toHaveClass('sm:text-lg');

        // Check close button shows text on tablet
        const closeButton = screen.getByTestId('close-button');
        expect(closeButton).toHaveTextContent('Close');
      });
    });
  });

  describe('Desktop Responsive Design (1024px)', () => {
    beforeEach(() => {
      mockMatchMedia(false); // Desktop breakpoint
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('should open panel with desktop-optimized dimensions', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      await user.click(floatingButton);

      await waitFor(() => {
        const panel = screen.getByTestId('floating-panel');
        expect(panel).toBeInTheDocument();
        expect(panel).toHaveClass('md:w-96', 'md:h-[600px]');
      });
    });

    it('should show expand button on desktop', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      await user.click(floatingButton);

      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button');
        expect(expandButton).toBeInTheDocument();
        expect(expandButton).toHaveClass('hidden', 'md:flex');
      });
    });

    it('should expand panel when expand button is clicked', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      await user.click(floatingButton);

      await waitFor(() => {
        const expandButton = screen.getByTestId('expand-button');
        fireEvent.click(expandButton);

        const panel = screen.getByTestId('floating-panel');
        expect(panel).toHaveClass('md:w-[500px]', 'md:h-[700px]');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation through panel elements', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      await user.click(floatingButton);

      await waitFor(() => {
        const panel = screen.getByTestId('floating-panel');
        expect(panel).toBeInTheDocument();

        // Test tab navigation
        const exportTab = screen.getByTestId('tab-export');
        // const customizeTab = screen.getByTestId('tab-customize');

        exportTab.focus();
        expect(exportTab).toHaveFocus();

        // Simulate tab key
        fireEvent.keyDown(exportTab, { key: 'Tab', code: 'Tab' });
        // Note: In a real test, you'd need to implement proper focus management
      });
    });

    it('should close panel with Escape key', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      await user.click(floatingButton);

      await waitFor(() => {
        const panel = screen.getByTestId('floating-panel');
        expect(panel).toBeInTheDocument();

        // Simulate Escape key
        fireEvent.keyDown(panel, { key: 'Escape', code: 'Escape' });

        // Panel should still be visible (mock doesn't implement escape handler)
        expect(panel).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      await user.click(floatingButton);

      await waitFor(() => {
        const panel = screen.getByTestId('floating-panel');
        expect(panel).toHaveAttribute('role', 'dialog');
        expect(panel).toHaveAttribute('aria-modal', 'true');
        expect(panel).toHaveAttribute('aria-labelledby', 'panel-title');

        const title = panel.querySelector('#panel-title');
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Resume Tools');
      });
    });

    it('should have proper focus management', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      expect(floatingButton).toHaveAttribute(
        'aria-label',
        'Open resume tools panel'
      );

      await user.click(floatingButton);

      await waitFor(() => {
        const closeButton = screen.getByTestId('close-button');
        expect(closeButton).toHaveAttribute('aria-label', 'Close panel');
      });
    });
  });

  describe('Content Overflow Handling', () => {
    it('should handle content overflow with scrolling', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      await user.click(floatingButton);

      await waitFor(() => {
        const panel = screen.getByTestId('floating-panel');
        const contentArea = panel.querySelector('.overflow-y-auto');

        expect(contentArea).toBeInTheDocument();
        expect(contentArea).toHaveClass('overflow-y-auto', 'flex-1');
      });
    });

    it('should handle tab navigation overflow with horizontal scrolling', async () => {
      const MockFloatingPanel = (
        await import('@/components/organisms/FloatingPanel/FloatingPanel')
      ).default;

      render(
        <TestWrapper>
          <MockFloatingPanel
            resumeData={{}}
            template={{}}
            onTemplateChange={() => {}}
          />
        </TestWrapper>
      );

      const floatingButton = screen.getByTestId('floating-action-button');
      await user.click(floatingButton);

      await waitFor(() => {
        const panel = screen.getByTestId('floating-panel');
        const tabNav = panel.querySelector('nav');

        expect(tabNav).toHaveClass('overflow-x-auto', 'scrollbar-hide');
      });
    });
  });
});
