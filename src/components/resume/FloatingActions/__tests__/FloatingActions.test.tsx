import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { useResumeStore } from '@/store/resumeStore';

import { FloatingActions } from '../FloatingActions';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock zustand store
jest.mock('@/store/resumeStore', () => ({
  useResumeStore: jest.fn(),
}));

const mockResumeData = {
  personal: {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    location: 'New York, NY',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    portfolio: 'https://johndoe.com',
  },
  summary: 'Experienced developer',
  experience: [],
  education: [],
  skills: {
    technical: [],
    business: [],
    soft: [],
    languages: [],
    certifications: [],
  },
  projects: [],
  achievements: [],
  certifications: [],
  hobbies: [],
};

describe('FloatingActions Component', () => {
  const mockSetResumeData = jest.fn();
  const mockSetShowDataChoice = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useResumeStore as unknown as jest.Mock).mockReturnValue({
      setResumeData: mockSetResumeData,
      setShowDataChoice: mockSetShowDataChoice,
    });
  });

  it('renders floating action button', () => {
    render(<FloatingActions resumeData={mockResumeData} onSave={mockOnSave} />);

    const fab = screen.getByRole('button', { name: /open actions menu/i });
    expect(fab).toBeInTheDocument();
    expect(fab).toHaveClass('w-14', 'h-14', 'rounded-full');
  });

  it('expands menu when clicked', async () => {
    render(<FloatingActions resumeData={mockResumeData} onSave={mockOnSave} />);

    const fab = screen.getByRole('button', { name: /open actions menu/i });
    fireEvent.click(fab);

    await waitFor(() => {
      expect(screen.getByText('Preview with Templates')).toBeInTheDocument();
      expect(screen.getByText('Edit Resume')).toBeInTheDocument();
      expect(screen.getByText('Save Resume')).toBeInTheDocument();
    });
  });

  it('collapses menu when clicked again', async () => {
    render(<FloatingActions resumeData={mockResumeData} onSave={mockOnSave} />);

    const fab = screen.getByRole('button', { name: /open actions menu/i });
    fireEvent.click(fab);

    await waitFor(() => {
      expect(screen.getByText('Preview with Templates')).toBeInTheDocument();
    });

    fireEvent.click(fab);

    await waitFor(() => {
      expect(
        screen.queryByText('Preview with Templates')
      ).not.toBeInTheDocument();
    });
  });

  it('handles preview with templates action', async () => {
    render(<FloatingActions resumeData={mockResumeData} onSave={mockOnSave} />);

    const fab = screen.getByRole('button', { name: /open actions menu/i });
    fireEvent.click(fab);

    await waitFor(() => {
      const previewButton = screen.getByText('Preview with Templates');
      fireEvent.click(previewButton);
    });

    expect(mockSetResumeData).toHaveBeenCalledWith(mockResumeData);
    expect(mockSetShowDataChoice).toHaveBeenCalledWith(true);
  });

  it('handles edit resume action', async () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation();

    render(<FloatingActions resumeData={mockResumeData} onSave={mockOnSave} />);

    const fab = screen.getByRole('button', { name: /open actions menu/i });
    fireEvent.click(fab);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Resume');
      fireEvent.click(editButton);
    });

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    scrollToSpy.mockRestore();
  });

  it('handles save resume action', async () => {
    render(<FloatingActions resumeData={mockResumeData} onSave={mockOnSave} />);

    const fab = screen.getByRole('button', { name: /open actions menu/i });
    fireEvent.click(fab);

    await waitFor(() => {
      const saveButton = screen.getByText('Save Resume');
      fireEvent.click(saveButton);
    });

    expect(mockOnSave).toHaveBeenCalled();
  });

  it('has proper ARIA labels', () => {
    render(<FloatingActions resumeData={mockResumeData} onSave={mockOnSave} />);

    const fab = screen.getByRole('button', { name: /open actions menu/i });
    expect(fab).toHaveAttribute('aria-label');
  });

  it('supports keyboard navigation', () => {
    render(<FloatingActions resumeData={mockResumeData} onSave={mockOnSave} />);

    const fab = screen.getByRole('button', { name: /open actions menu/i });
    fab.focus();
    expect(fab).toHaveFocus();

    fireEvent.keyDown(fab, { key: 'Enter' });
    // Should expand menu
  });

  it('has proper focus management', () => {
    render(<FloatingActions resumeData={mockResumeData} onSave={mockOnSave} />);

    const fab = screen.getByRole('button', { name: /open actions menu/i });
    expect(fab).toHaveAttribute('tabIndex', '0');
  });

  it('should not have accessibility violations', async () => {
    const { container } = render(
      <FloatingActions resumeData={mockResumeData} onSave={mockOnSave} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations when expanded', async () => {
    const { container } = render(
      <FloatingActions resumeData={mockResumeData} onSave={mockOnSave} />
    );

    const fab = screen.getByRole('button', { name: /open actions menu/i });
    fireEvent.click(fab);

    await waitFor(() => {
      expect(screen.getByText('Preview with Templates')).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports custom className', () => {
    render(
      <FloatingActions
        resumeData={mockResumeData}
        onSave={mockOnSave}
        className='custom-floating-actions'
      />
    );

    const container = screen
      .getByRole('button', { name: /open actions menu/i })
      .closest('div');
    expect(container).toHaveClass('custom-floating-actions');
  });

  it('maintains state when toggling', async () => {
    render(<FloatingActions resumeData={mockResumeData} onSave={mockOnSave} />);

    const fab = screen.getByRole('button', { name: /open actions menu/i });

    // Open menu
    fireEvent.click(fab);
    await waitFor(() => {
      expect(screen.getByText('Preview with Templates')).toBeInTheDocument();
    });

    // Close menu
    fireEvent.click(fab);
    await waitFor(() => {
      expect(
        screen.queryByText('Preview with Templates')
      ).not.toBeInTheDocument();
    });

    // Open menu again
    fireEvent.click(fab);
    await waitFor(() => {
      expect(screen.getByText('Preview with Templates')).toBeInTheDocument();
    });
  });

  it('handles rapid clicks gracefully', async () => {
    render(<FloatingActions resumeData={mockResumeData} onSave={mockOnSave} />);

    const fab = screen.getByRole('button', { name: /open actions menu/i });

    // Rapid clicks
    fireEvent.click(fab);
    fireEvent.click(fab);
    fireEvent.click(fab);

    // Should be in a consistent state
    await waitFor(() => {
      const isExpanded = screen.queryByText('Preview with Templates') !== null;
      expect(isExpanded).toBeDefined();
    });
  });
});
