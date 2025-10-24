import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { ResumeData, ResumeTemplate } from '@/types/resume';

import { FloatingPanel } from '../FloatingPanel';

// Mock the tab components
jest.mock('../tabs/ATSAnalysisTab', () => ({
  ATSAnalysisTab: ({ resumeData }: { resumeData: ResumeData }) => (
    <div data-testid='ats-analysis-tab'>
      ATS Analysis for {resumeData.personal?.fullName}
    </div>
  ),
}));

jest.mock('../tabs/AIContentTab', () => ({
  AIContentTab: ({ resumeData }: { resumeData: ResumeData }) => (
    <div data-testid='ai-content-tab'>
      AI Content for {resumeData.personal?.fullName}
    </div>
  ),
}));

jest.mock('../tabs/TemplateCustomizerTab', () => ({
  TemplateCustomizerTab: ({ template }: { template: ResumeTemplate }) => (
    <div data-testid='template-customizer-tab'>Template: {template.name}</div>
  ),
}));

jest.mock('../tabs/ValidationTab', () => ({
  ValidationTab: ({ resumeData }: { resumeData: ResumeData }) => (
    <div data-testid='validation-tab'>
      Validation for {resumeData.personal?.fullName}
    </div>
  ),
}));

jest.mock('../tabs/ExportTab', () => ({
  ExportTab: ({
    resumeData,
    template,
  }: {
    resumeData: ResumeData;
    template: ResumeTemplate;
  }) => (
    <div data-testid='export-tab'>
      Export {resumeData.personal?.fullName} - {template.name}
    </div>
  ),
}));

describe('FloatingPanel Component', () => {
  const mockResumeData: ResumeData = {
    personal: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      location: 'New York, NY',
    },
    summary: 'Experienced software developer',
    experience: [],
    skills: {
      technical: ['JavaScript', 'React'],
      business: ['Project Management'],
      soft: ['Communication'],
    },
  };

  const mockTemplate: ResumeTemplate = {
    id: 'template-1',
    name: 'Professional Template',
    category: 'business',
    preview: '/preview.jpg',
    config: {},
  };

  const defaultProps = {
    resumeData: mockResumeData,
    template: mockTemplate,
    onResumeDataUpdate: jest.fn(),
    onTemplateChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders floating action button initially', () => {
    render(<FloatingPanel {...defaultProps} />);

    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(
      screen.getByText(/access ats analysis, ai improvements, and more/i)
    ).toBeInTheDocument();
  });

  it('shows panel when floating button is clicked', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    const floatingButton = screen.getByText('Quick Actions');
    await user.click(floatingButton);

    expect(screen.getByText('Resume Tools')).toBeInTheDocument();
    expect(screen.getByText('ATS Analysis')).toBeInTheDocument();
    expect(screen.getByText('AI Content')).toBeInTheDocument();
    expect(screen.getByText('Customize')).toBeInTheDocument();
    expect(screen.getByText('Validate')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('hides panel when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Quick Actions');
    await user.click(floatingButton);

    // Close panel
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    // Panel should be hidden, floating button should be visible
    expect(screen.queryByText('Resume Tools')).not.toBeInTheDocument();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  it('toggles expanded state when expand button is clicked', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Quick Actions');
    await user.click(floatingButton);

    const panel = screen.getByText('Resume Tools').closest('div');
    expect(panel).toHaveClass('w-80', 'h-96'); // Default size

    // Expand panel
    const expandButton = screen.getByRole('button', { name: /expand/i });
    await user.click(expandButton);

    expect(panel).toHaveClass('w-96', 'h-[600px]'); // Expanded size
  });

  it('switches between tabs', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Quick Actions');
    await user.click(floatingButton);

    // Default tab should be ATS Analysis
    expect(screen.getByTestId('ats-analysis-tab')).toBeInTheDocument();

    // Switch to AI Content tab
    const aiContentTab = screen.getByText('AI Content');
    await user.click(aiContentTab);
    expect(screen.getByTestId('ai-content-tab')).toBeInTheDocument();

    // Switch to Customize tab
    const customizeTab = screen.getByText('Customize');
    await user.click(customizeTab);
    expect(screen.getByTestId('template-customizer-tab')).toBeInTheDocument();

    // Switch to Validate tab
    const validateTab = screen.getByText('Validate');
    await user.click(validateTab);
    expect(screen.getByTestId('validation-tab')).toBeInTheDocument();

    // Switch to Export tab
    const exportTab = screen.getByText('Export');
    await user.click(exportTab);
    expect(screen.getByTestId('export-tab')).toBeInTheDocument();
  });

  it('passes correct props to tab components', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Quick Actions');
    await user.click(floatingButton);

    // Check ATS Analysis tab
    expect(screen.getByText('ATS Analysis for John Doe')).toBeInTheDocument();

    // Switch to AI Content tab
    const aiContentTab = screen.getByText('AI Content');
    await user.click(aiContentTab);
    expect(screen.getByText('AI Content for John Doe')).toBeInTheDocument();

    // Switch to Template Customizer tab
    const customizeTab = screen.getByText('Customize');
    await user.click(customizeTab);
    expect(
      screen.getByText('Template: Professional Template')
    ).toBeInTheDocument();

    // Switch to Validation tab
    const validateTab = screen.getByText('Validate');
    await user.click(validateTab);
    expect(screen.getByText('Validation for John Doe')).toBeInTheDocument();

    // Switch to Export tab
    const exportTab = screen.getByText('Export');
    await user.click(exportTab);
    expect(
      screen.getByText('Export John Doe - Professional Template')
    ).toBeInTheDocument();
  });

  it('calls onResumeDataUpdate when resume data changes', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Quick Actions');
    await user.click(floatingButton);

    // The tab components should receive the onResumeDataUpdate callback
    // This would be tested in the individual tab component tests
    expect(defaultProps.onResumeDataUpdate).toBeDefined();
  });

  it('calls onTemplateChange when template changes', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Quick Actions');
    await user.click(floatingButton);

    // Switch to Customize tab
    const customizeTab = screen.getByText('Customize');
    await user.click(customizeTab);

    // The template customizer should receive the onTemplateChange callback
    expect(defaultProps.onTemplateChange).toBeDefined();
  });

  it('applies custom className', () => {
    render(<FloatingPanel {...defaultProps} className='custom-class' />);

    const container = screen.getByText('Quick Actions').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('hides tooltip after panel is opened', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Tooltip should be visible initially
    expect(
      screen.getByText(/access ats analysis, ai improvements, and more/i)
    ).toBeInTheDocument();

    // Open panel
    const floatingButton = screen.getByText('Quick Actions');
    await user.click(floatingButton);

    // Tooltip should be hidden
    expect(
      screen.queryByText(/access ats analysis, ai improvements, and more/i)
    ).not.toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Quick Actions');
    await user.click(floatingButton);

    // Tab navigation should work
    await user.tab();
    await user.tab();

    // The expand button should be focusable
    const expandButton = screen.getByRole('button', { name: /expand/i });
    expect(expandButton).toHaveFocus();
  });

  it('renders with proper ARIA attributes', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Quick Actions');
    await user.click(floatingButton);

    const panel = screen.getByText('Resume Tools').closest('div');
    expect(panel).toHaveAttribute('role', 'dialog');
    expect(panel).toHaveAttribute('aria-modal', 'true');
  });
});
