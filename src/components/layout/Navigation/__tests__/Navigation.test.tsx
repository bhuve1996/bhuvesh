import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Navigation } from '../Navigation';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: any }) => (
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

    const menubar = screen.getByRole('menubar');
    expect(menubar).toBeInTheDocument();
    expect(menubar).toHaveClass('hidden', 'md:flex');
  });

  it('renders navigation items with proper roles', () => {
    render(<Navigation {...defaultProps} />);

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems).toHaveLength(5); // Based on NAV_ITEMS

    menuItems.forEach(item => {
      expect(item).toHaveAttribute('tabIndex', '0');
    });
  });

  it('highlights active section', () => {
    render(<Navigation {...defaultProps} activeSection='about' />);

    const aboutLink = screen.getByRole('menuitem', { name: /about/i });
    expect(aboutLink).toHaveAttribute('aria-current', 'page');
    expect(aboutLink).toHaveClass('text-primary-400', 'bg-primary-500/10');
  });

  it('handles section clicks', () => {
    const onSectionClick = jest.fn();
    render(<Navigation {...defaultProps} onSectionClick={onSectionClick} />);

    const aboutLink = screen.getByRole('menuitem', { name: /about/i });
    fireEvent.click(aboutLink);

    expect(onSectionClick).toHaveBeenCalledWith('about');
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
    const mobileMenu = screen.getByRole('menu', { hidden: true });

    expect(mobileMenu).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(mobileButton);

    await waitFor(() => {
      expect(mobileButton).toHaveAttribute('aria-expanded', 'true');
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

    const aboutLink = screen.getByRole('menuitem', { name: /about/i });
    fireEvent.click(aboutLink);

    await waitFor(() => {
      expect(screen.getByRole('menu')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('supports keyboard navigation', () => {
    render(<Navigation {...defaultProps} />);

    const mobileButton = screen.getByLabelText('Toggle mobile menu');
    mobileButton.focus();

    expect(mobileButton).toHaveFocus();

    fireEvent.keyDown(mobileButton, { key: 'Enter' });
    expect(mobileButton).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(mobileButton, { key: ' ' });
    expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('has proper focus management', () => {
    render(<Navigation {...defaultProps} />);

    const links = screen.getAllByRole('menuitem');
    links.forEach(link => {
      expect(link).toHaveAttribute('tabIndex', '0');

      link.focus();
      expect(link).toHaveFocus();
    });
  });

  it('renders theme toggle', () => {
    render(<Navigation {...defaultProps} />);

    const themeToggle = screen.getByLabelText(/switch to.*mode/i);
    expect(themeToggle).toBeInTheDocument();
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

    // Desktop menu should be visible
    expect(screen.getByRole('menubar')).toHaveClass('hidden', 'md:flex');
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

    const menubar = screen.getByRole('menubar');
    expect(menubar).toBeInTheDocument();

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.length).toBeGreaterThan(0);
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
      firstMenuItem.focus();
      expect(firstMenuItem).toHaveFocus();
    }
  });

  it('maintains focus when switching between desktop and mobile', () => {
    render(<Navigation {...defaultProps} />);

    const desktopLinks = screen.getAllByRole('menuitem');
    const desktopLink = desktopLinks[0];
    if (desktopLink) {
      desktopLink.focus();
      expect(desktopLink).toHaveFocus();
    }

    const mobileButton = screen.getByLabelText('Toggle mobile menu');
    mobileButton.focus();
    expect(mobileButton).toHaveFocus();
  });
});
