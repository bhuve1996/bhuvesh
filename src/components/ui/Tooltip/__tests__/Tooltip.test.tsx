import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Tooltip } from '../Tooltip';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Tooltip Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders children without tooltip initially', () => {
    render(
      <Tooltip content='Test tooltip'>
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on hover after delay', async () => {
    render(
      <Tooltip content='Test tooltip' delay={100}>
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);

    // Fast-forward time by 100ms
    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });
  });

  it('hides tooltip on mouse leave', async () => {
    render(
      <Tooltip content='Test tooltip' delay={100}>
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });

    fireEvent.mouseLeave(button);

    await waitFor(() => {
      expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
    });
  });

  it('shows tooltip on focus', async () => {
    render(
      <Tooltip content='Test tooltip' delay={100}>
        <button>Focus me</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    fireEvent.focus(button);
    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });
  });

  it('hides tooltip on blur', async () => {
    render(
      <Tooltip content='Test tooltip' delay={100}>
        <button>Focus me</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    fireEvent.focus(button);
    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });

    fireEvent.blur(button);

    await waitFor(() => {
      expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
    });
  });

  it('respects disabled prop', async () => {
    render(
      <Tooltip content='Test tooltip' disabled>
        <button>Disabled tooltip</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    jest.advanceTimersByTime(1000);

    expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
  });

  it('positions tooltip correctly', async () => {
    const { rerender } = render(
      <Tooltip content='Top tooltip' position='top'>
        <button>Top</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      const tooltip = screen.getByText('Top tooltip');
      expect(tooltip).toHaveClass(
        'bottom-full',
        'left-1/2',
        'transform',
        '-translate-x-1/2',
        'mb-2'
      );
    });

    rerender(
      <Tooltip content='Bottom tooltip' position='bottom'>
        <button>Bottom</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(button);
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      const tooltip = screen.getByText('Bottom tooltip');
      expect(tooltip).toHaveClass(
        'top-full',
        'left-1/2',
        'transform',
        '-translate-x-1/2',
        'mt-2'
      );
    });

    rerender(
      <Tooltip content='Left tooltip' position='left'>
        <button>Left</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(button);
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      const tooltip = screen.getByText('Left tooltip');
      expect(tooltip).toHaveClass(
        'right-full',
        'top-1/2',
        'transform',
        '-translate-y-1/2',
        'mr-2'
      );
    });

    rerender(
      <Tooltip content='Right tooltip' position='right'>
        <button>Right</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(button);
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      const tooltip = screen.getByText('Right tooltip');
      expect(tooltip).toHaveClass(
        'left-full',
        'top-1/2',
        'transform',
        '-translate-y-1/2',
        'ml-2'
      );
    });
  });

  it('supports custom className', () => {
    render(
      <Tooltip content='Custom tooltip' className='custom-tooltip'>
        <button>Custom</button>
      </Tooltip>
    );

    const container = screen.getByRole('button').parentElement;
    expect(container).toHaveClass('custom-tooltip');
  });

  it('cleans up timeouts on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount } = render(
      <Tooltip content='Test tooltip'>
        <button>Test</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('should not have accessibility violations', async () => {
    const { container } = render(
      <Tooltip content='Accessible tooltip'>
        <button>Accessible</button>
      </Tooltip>
    );

    // Wait for any async operations to complete
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 10000);

  it('should not have accessibility violations when tooltip is visible', async () => {
    const { container } = render(
      <Tooltip content='Visible tooltip'>
        <button>Visible</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText('Visible tooltip')).toBeInTheDocument();
    });

    // Wait a bit more to ensure axe can run properly
    await new Promise(resolve => setTimeout(resolve, 100));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 10000);

  it('handles rapid mouse enter/leave events', async () => {
    render(
      <Tooltip content='Rapid tooltip' delay={100}>
        <button>Rapid</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');

    // Rapid enter/leave
    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);
    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);

    jest.advanceTimersByTime(1000);

    // Should not show tooltip due to rapid events
    expect(screen.queryByText('Rapid tooltip')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    render(
      <Tooltip content='Keyboard tooltip' delay={100}>
        <button>Keyboard</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    button.focus();
    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(screen.getByText('Keyboard tooltip')).toBeInTheDocument();
    });

    fireEvent.blur(button);

    await waitFor(() => {
      expect(screen.queryByText('Keyboard tooltip')).not.toBeInTheDocument();
    });
  });
});
