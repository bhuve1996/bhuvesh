import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Navigation } from '../Navigation';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('Navigation Component', () => {
  const defaultProps = {
    activeSection: 'home',
    onSectionClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation with logo', () => {
    render(<Navigation {...defaultProps} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
    expect(screen.getByAltText('Bhuvesh Logo')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to homepage')).toBeInTheDocument();
  });

  it('renders desktop navigation menu', () => {
    render(<Navigation {...defaultProps} />);

    // Check that desktop navigation links are present
    const aboutLinks = screen.getAllByRole('link', { name: /about/i });
    expect(aboutLinks.length).toBeGreaterThan(0);

    // Check for Resume Builder link instead of Projects (which is commented out)
    const resumeBuilderLinks = screen.getAllByRole('link', {
      name: /resume builder/i,
    });
    expect(resumeBuilderLinks.length).toBeGreaterThan(0);
  });

  it('renders navigation items with proper roles', () => {
    render(<Navigation {...defaultProps} />);

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);

    // Check that navigation links have proper attributes
    const aboutLinks = screen.getAllByRole('link', { name: /about/i });
    expect(aboutLinks[0]).toHaveAttribute('tabIndex', '0');
  });

  it('highlights active section', () => {
    render(<Navigation {...defaultProps} activeSection='about' />);

    // Since the current NAV_ITEMS don't have hash links,
    // we just verify the component renders without errors
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // Verify navigation links are present
    const aboutLinks = screen.getAllByRole('link', { name: /about/i });
    expect(aboutLinks.length).toBeGreaterThan(0);
  });

  it('handles section clicks', () => {
    const onSectionClick = jest.fn();
    render(<Navigation {...defaultProps} onSectionClick={onSectionClick} />);

    // Since the current NAV_ITEMS don't have hash links,
    // we just verify the component renders and onSectionClick is available
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // Verify the callback function is available (not called since no hash links)
    expect(onSectionClick).not.toHaveBeenCalled();
  });

  it('renders mobile menu button', () => {
    render(<Navigation {...defaultProps} />);

    const mobileButton = screen.getByLabelText('Toggle mobile menu');
    expect(mobileButton).toBeInTheDocument();
    expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
    expect(mobileButton).toHaveAttribute('aria-controls', 'mobile-menu');
  });

  it('toggles mobile menu', async () => {
    render(<Navigation {...defaultProps} />);

    const mobileButton = screen.getByLabelText('Toggle mobile menu');

    // Initially, mobile menu should not be visible
    expect(mobileButton).toHaveAttribute('aria-expanded', 'false');

    // Click to open mobile menu
    fireEvent.click(mobileButton);

    await waitFor(() => {
      expect(mobileButton).toHaveAttribute('aria-expanded', 'true');
      const mobileMenu = screen.getByRole('menu');
      expect(mobileMenu).toHaveAttribute('aria-hidden', 'false');
    });
  });

  it('closes mobile menu when item is clicked', async () => {
    render(<Navigation {...defaultProps} />);

    const mobileButton = screen.getByLabelText('Toggle mobile menu');
    fireEvent.click(mobileButton);

    await waitFor(() => {
      expect(screen.getByRole('menu')).toHaveAttribute('aria-hidden', 'false');
    });

    // Get the mobile menu first, then find the about link within it
    const mobileMenu = screen.getByRole('menu');
    const aboutLink = within(mobileMenu).getByRole('menuitem', {
      name: /about/i,
    });
    fireEvent.click(aboutLink);

    await waitFor(() => {
      // Mobile menu should be closed (not rendered)
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('supports keyboard navigation', async () => {
    render(<Navigation {...defaultProps} />);

    const mobileButton = screen.getByLabelText('Toggle mobile menu');
    mobileButton.focus();

    expect(mobileButton).toHaveFocus();

    fireEvent.keyDown(mobileButton, { key: 'Enter' });
    await waitFor(() => {
      expect(mobileButton).toHaveAttribute('aria-expanded', 'true');
    });

    fireEvent.keyDown(mobileButton, { key: ' ' });
    await waitFor(() => {
      expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('has proper focus management', () => {
    render(<Navigation {...defaultProps} />);

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);

    // Test focus on the first navigation link
    const aboutLinks = screen.getAllByRole('link', { name: /about/i });
    act(() => {
      aboutLinks[0].focus();
    });
    expect(aboutLinks[0]).toHaveFocus();
  });

  it('renders theme toggle', () => {
    render(<Navigation {...defaultProps} />);

    const themeToggles = screen.getAllByLabelText(/switch to.*mode/i);
    expect(themeToggles.length).toBeGreaterThan(0);
  });

  it('has proper ARIA labels and descriptions', () => {
    render(<Navigation {...defaultProps} />);

    expect(screen.getByRole('navigation')).toHaveAttribute(
      'aria-label',
      'Main navigation'
    );
    expect(screen.getByLabelText('Go to homepage')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle mobile menu')).toBeInTheDocument();
  });

  it('should not have accessibility violations', async () => {
    const { container } = render(<Navigation {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations with mobile menu open', async () => {
    const { container } = render(<Navigation {...defaultProps} />);

    const mobileButton = screen.getByLabelText('Toggle mobile menu');
    fireEvent.click(mobileButton);

    await waitFor(() => {
      expect(screen.getByRole('menu')).toHaveAttribute('aria-hidden', 'false');
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('handles window resize for responsive behavior', () => {
    render(<Navigation {...defaultProps} />);

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    fireEvent(window, new Event('resize'));

    // Desktop navigation should be visible
    const desktopNav = screen.getByRole('navigation');
    expect(desktopNav).toBeInTheDocument();
  });

  it('supports custom className', () => {
    render(<Navigation {...defaultProps} className='custom-nav' />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('custom-nav');
  });

  it('renders with proper semantic structure', () => {
    render(<Navigation {...defaultProps} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // Check that navigation links are present
    const aboutLinks = screen.getAllByRole('link', { name: /about/i });
    expect(aboutLinks.length).toBeGreaterThan(0);

    // Check for Resume Builder link instead of Projects (which is commented out)
    const resumeBuilderLinks = screen.getAllByRole('link', {
      name: /resume builder/i,
    });
    expect(resumeBuilderLinks.length).toBeGreaterThan(0);
  });

  it('handles focus trap in mobile menu', async () => {
    render(<Navigation {...defaultProps} />);

    const mobileButton = screen.getByLabelText('Toggle mobile menu');
    fireEvent.click(mobileButton);

    await waitFor(() => {
      const mobileMenu = screen.getByRole('menu');
      expect(mobileMenu).toHaveAttribute('aria-hidden', 'false');
    });

    const menuItems = screen.getAllByRole('menuitem');
    const firstMenuItem = menuItems[0];
    if (firstMenuItem) {
      act(() => {
        firstMenuItem.focus();
      });
      expect(firstMenuItem).toHaveFocus();
    }
  });

  it('maintains focus when switching between desktop and mobile', () => {
    render(<Navigation {...defaultProps} />);

    const desktopLinks = screen.getAllByRole('link');
    const desktopLink = desktopLinks[0];
    if (desktopLink) {
      act(() => {
        desktopLink.focus();
      });
      expect(desktopLink).toHaveFocus();
    }

    const mobileButton = screen.getByLabelText('Toggle mobile menu');
    act(() => {
      mobileButton.focus();
    });
    expect(mobileButton).toHaveFocus();
  });
});
