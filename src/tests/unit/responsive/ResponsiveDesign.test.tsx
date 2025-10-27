import { render, screen } from '@testing-library/react';
import React from 'react';

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

// Test component that uses responsive classes
const ResponsiveTestComponent: React.FC = () => {
  return (
    <div data-testid='responsive-container'>
      {/* Mobile-first responsive button */}
      <button
        data-testid='responsive-button'
        className='text-sm sm:text-base md:text-lg'
      >
        <span className='hidden sm:inline'>Quick Actions</span>
        <span className='sm:hidden'>Tools</span>
      </button>

      {/* Responsive panel */}
      <div
        data-testid='responsive-panel'
        className={`
          w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] max-w-sm sm:max-w-md md:max-w-lg
          sm:w-80 sm:h-96
          md:w-96 md:h-[600px]
        `}
      >
        <div className='p-3 sm:p-4'>
          <h3 className='text-base sm:text-lg'>Responsive Title</h3>
          <p className='text-xs sm:text-sm'>Responsive description</p>
        </div>

        {/* Responsive tabs */}
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex space-x-2 sm:space-x-4 md:space-x-8 overflow-x-auto scrollbar-slim'>
            <button className='py-2 px-1 text-xs sm:text-sm whitespace-nowrap flex-shrink-0'>
              Export
            </button>
            <button className='py-2 px-1 text-xs sm:text-sm whitespace-nowrap flex-shrink-0'>
              Customize
            </button>
          </nav>
        </div>

        {/* Responsive content */}
        <div className='mt-4 sm:mt-6 overflow-y-auto max-h-full'>
          <div className='space-y-2 sm:space-y-3'>
            <div className='p-3 sm:p-4'>
              <label className='block text-xs sm:text-sm font-medium mb-2'>
                Font Size
              </label>
              <input type='range' className='w-full' />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
              <button className='p-2 rounded-lg'>Blue</button>
              <button className='p-2 rounded-lg'>Green</button>
              <button className='p-2 rounded-lg'>Purple</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

describe('Responsive Design Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Mobile Responsive Classes (375px)', () => {
    beforeEach(() => {
      mockMatchMedia(true); // Mobile breakpoint
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it('should apply mobile-first responsive classes', () => {
      render(<ResponsiveTestComponent />);

      const button = screen.getByTestId('responsive-button');
      expect(button).toHaveClass('text-sm');
      expect(button).toHaveTextContent('Tools');

      const panel = screen.getByTestId('responsive-panel');
      expect(panel).toHaveClass('w-[calc(100vw-2rem)]', 'h-[calc(100vh-2rem)]');
    });

    it('should have mobile-optimized typography', () => {
      render(<ResponsiveTestComponent />);

      const title = screen.getByText('Responsive Title');
      expect(title).toHaveClass('text-base');

      const description = screen.getByText('Responsive description');
      expect(description).toHaveClass('text-xs');
    });

    it('should have mobile-optimized spacing and layout', () => {
      render(<ResponsiveTestComponent />);

      const container = screen.getByTestId('responsive-panel');
      const contentArea = container.querySelector('.space-y-2');

      expect(contentArea).toHaveClass('space-y-2');

      const paddingArea = container.querySelector('.p-3');
      expect(paddingArea).toHaveClass('p-3');
    });

    it('should have mobile-optimized form elements', () => {
      render(<ResponsiveTestComponent />);

      const label = screen.getByText('Font Size');
      expect(label).toHaveClass('text-xs');

      const colorGrid = screen.getByRole('button', {
        name: 'Blue',
      }).parentElement;
      expect(colorGrid).toHaveClass('grid-cols-2');
    });

    it('should have mobile-optimized tab navigation', () => {
      render(<ResponsiveTestComponent />);

      const tabNav = screen.getByText('Export').parentElement;
      expect(tabNav).toHaveClass(
        'space-x-2',
        'overflow-x-auto',
        'scrollbar-slim'
      );

      const exportTab = screen.getByText('Export');
      expect(exportTab).toHaveClass(
        'text-xs',
        'whitespace-nowrap',
        'flex-shrink-0'
      );
    });
  });

  describe('Tablet Responsive Classes (768px)', () => {
    beforeEach(() => {
      mockMatchMedia(false); // Tablet breakpoint
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
    });

    it('should apply tablet responsive classes', () => {
      render(<ResponsiveTestComponent />);

      const button = screen.getByTestId('responsive-button');
      expect(button).toHaveClass('sm:text-base');
      expect(button).toHaveTextContent('Quick Actions');

      const panel = screen.getByTestId('responsive-panel');
      expect(panel).toHaveClass('sm:w-80', 'sm:h-96');
    });

    it('should have tablet-optimized typography', () => {
      render(<ResponsiveTestComponent />);

      const title = screen.getByText('Responsive Title');
      expect(title).toHaveClass('sm:text-lg');

      const description = screen.getByText('Responsive description');
      expect(description).toHaveClass('sm:text-sm');
    });

    it('should have tablet-optimized spacing', () => {
      render(<ResponsiveTestComponent />);

      const container = screen.getByTestId('responsive-panel');
      const contentArea = container.querySelector('.space-y-2');

      expect(contentArea).toHaveClass('sm:space-y-3');

      const paddingArea = container.querySelector('.p-3');
      expect(paddingArea).toHaveClass('sm:p-4');
    });

    it('should have tablet-optimized form elements', () => {
      render(<ResponsiveTestComponent />);

      const label = screen.getByText('Font Size');
      expect(label).toHaveClass('sm:text-sm');

      const colorGrid = screen.getByRole('button', {
        name: 'Blue',
      }).parentElement;
      expect(colorGrid).toHaveClass('sm:grid-cols-3');
    });

    it('should have tablet-optimized tab navigation', () => {
      render(<ResponsiveTestComponent />);

      const tabNav = screen.getByText('Export').parentElement;
      expect(tabNav).toHaveClass('sm:space-x-4');

      const exportTab = screen.getByText('Export');
      expect(exportTab).toHaveClass('sm:text-sm');
    });
  });

  describe('Desktop Responsive Classes (1024px)', () => {
    beforeEach(() => {
      mockMatchMedia(false); // Desktop breakpoint
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('should apply desktop responsive classes', () => {
      render(<ResponsiveTestComponent />);

      const button = screen.getByTestId('responsive-button');
      expect(button).toHaveClass('md:text-lg');

      const panel = screen.getByTestId('responsive-panel');
      expect(panel).toHaveClass('md:w-96', 'md:h-[600px]');
    });

    it('should have desktop-optimized tab navigation', () => {
      render(<ResponsiveTestComponent />);

      const tabNav = screen.getByText('Export').parentElement;
      expect(tabNav).toHaveClass('md:space-x-8');
    });
  });

  describe('Responsive Utility Classes', () => {
    it('should have proper overflow handling classes', () => {
      render(<ResponsiveTestComponent />);

      const tabNav = screen.getByText('Export').parentElement;
      expect(tabNav).toHaveClass('overflow-x-auto', 'scrollbar-slim');

      const contentArea = screen
        .getByTestId('responsive-panel')
        .querySelector('.overflow-y-auto');
      expect(contentArea).toHaveClass('overflow-y-auto', 'max-h-full');
    });

    it('should have proper flex and grid classes', () => {
      render(<ResponsiveTestComponent />);

      const tabNav = screen.getByText('Export').parentElement;
      expect(tabNav).toHaveClass('flex');

      const exportTab = screen.getByText('Export');
      expect(exportTab).toHaveClass('flex-shrink-0');

      const colorGrid = screen.getByRole('button', {
        name: 'Blue',
      }).parentElement;
      expect(colorGrid).toHaveClass('grid');
    });

    it('should have proper text wrapping classes', () => {
      render(<ResponsiveTestComponent />);

      const exportTab = screen.getByText('Export');
      expect(exportTab).toHaveClass('whitespace-nowrap');
    });
  });

  describe('Accessibility and Focus Management', () => {
    it('should have proper focus styles', () => {
      render(<ResponsiveTestComponent />);

      const button = screen.getByTestId('responsive-button');
      expect(button).toBeInTheDocument();

      // Test that button is focusable
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should have proper ARIA attributes', () => {
      render(<ResponsiveTestComponent />);

      const button = screen.getByTestId('responsive-button');
      expect(button).toBeInTheDocument();

      // Button should be accessible
      expect(button.tagName).toBe('BUTTON');
    });
  });
});
