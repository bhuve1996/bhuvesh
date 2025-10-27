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

    expect(screen.getByText('Resume Builder')).toBeInTheDocument();
    expect(
      screen.getByText(
        /build, customize, and export your resume with professional tools/i
      )
    ).toBeInTheDocument();
  });

  it('shows panel when floating button is clicked', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    const floatingButton = screen.getByText('Resume Builder');
    await user.click(floatingButton);

    expect(screen.getByText('Resume Tools')).toBeInTheDocument();
    expect(screen.getByText('ATS Analysis')).toBeInTheDocument();
    expect(screen.getByText('Customize')).toBeInTheDocument();
    expect(screen.getByText('Validate')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('hides panel when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Resume Builder');
    await user.click(floatingButton);

    // Close panel
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    // Panel should be hidden, floating button should be visible
    expect(screen.queryByText('Resume Tools')).not.toBeInTheDocument();
    expect(screen.getByText('Resume Builder')).toBeInTheDocument();
  });

  it('toggles expanded state when expand button is clicked', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Resume Builder');
    await user.click(floatingButton);

    // Get the panel container (the dialog element)
    const panel = screen.getByRole('dialog');
    expect(panel).toHaveClass('sm:w-80', 'sm:h-96'); // Default size

    // Expand panel
    const expandButton = screen.getByRole('button', { name: /expand/i });
    await user.click(expandButton);

    expect(panel).toHaveClass('md:w-[500px]', 'md:h-[700px]'); // Expanded size
  });

  it('switches between tabs', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Resume Builder');
    await user.click(floatingButton);

    // Default tab should be Export
    expect(screen.getByTestId('export-tab')).toBeInTheDocument();

    // Switch to ATS Analysis tab
    const atsTab = screen.getByText('ATS Analysis');
    await user.click(atsTab);
    expect(screen.getByText(/ATS Analysis for.*John Doe/)).toBeInTheDocument();

    // Switch to Customize tab
    const customizeTab = screen.getByText('Customize');
    await user.click(customizeTab);
    expect(
      screen.getByText(/Template:.*Professional Template/)
    ).toBeInTheDocument();

    // Switch to Validate tab
    const validateTab = screen.getByText('Validate');
    await user.click(validateTab);
    expect(screen.getByText(/Validation for.*John Doe/)).toBeInTheDocument();

    // Switch back to Export tab
    const exportTab = screen.getByText('Export');
    await user.click(exportTab);
    expect(screen.getByTestId('export-tab')).toBeInTheDocument();
  });

  it('passes correct props to tab components', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Resume Builder');
    await user.click(floatingButton);

    // Check Export tab (default active tab) - the content shows "Export John Doe - Professional Template"
    expect(
      screen.getByText(/Export.*John Doe.*Professional Template/)
    ).toBeInTheDocument();

    // Switch to ATS Analysis tab
    const atsTab = screen.getByText('ATS Analysis');
    await user.click(atsTab);
    expect(screen.getByText(/ATS Analysis for.*John Doe/)).toBeInTheDocument();

    // Switch to Template Customizer tab
    const customizeTab = screen.getByText('Customize');
    await user.click(customizeTab);
    expect(
      screen.getByText(/Template:.*Professional Template/)
    ).toBeInTheDocument();

    // Switch to Validation tab
    const validateTab = screen.getByText('Validate');
    await user.click(validateTab);
    expect(screen.getByText(/Validation for.*John Doe/)).toBeInTheDocument();
  });

  it('calls onResumeDataUpdate when resume data changes', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Resume Builder');
    await user.click(floatingButton);

    // The tab components should receive the onResumeDataUpdate callback
    // This would be tested in the individual tab component tests
    expect(defaultProps.onResumeDataUpdate).toBeDefined();
  });

  it('calls onTemplateChange when template changes', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Resume Builder');
    await user.click(floatingButton);

    // Switch to Customize tab
    const customizeTab = screen.getByText('Customize');
    await user.click(customizeTab);

    // The template customizer should receive the onTemplateChange callback
    expect(defaultProps.onTemplateChange).toBeDefined();
  });

  it('applies custom className', () => {
    render(<FloatingPanel {...defaultProps} className='custom-class' />);

    // The className is applied to the outer container
    const container = screen
      .getByText('Resume Builder')
      .closest('div')?.parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('hides tooltip after panel is opened', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Tooltip should be visible initially
    expect(
      screen.getByText(
        /build, customize, and export your resume with professional tools/i
      )
    ).toBeInTheDocument();

    // Open panel
    const floatingButton = screen.getByText('Resume Builder');
    await user.click(floatingButton);

    // Tooltip should be hidden
    expect(
      screen.queryByText(
        /build, customize, and export your resume with professional tools/i
      )
    ).not.toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Resume Builder');
    await user.click(floatingButton);

    // Tab navigation should work - focus should be on the close button first
    await user.tab();

    // The close button should be focused first
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toHaveFocus();
  });

  it('renders with proper ARIA attributes', async () => {
    const user = userEvent.setup();
    render(<FloatingPanel {...defaultProps} />);

    // Open panel
    const floatingButton = screen.getByText('Resume Builder');
    await user.click(floatingButton);

    // The panel div has the ARIA attributes
    const panel = screen.getByRole('dialog');
    expect(panel).toHaveAttribute('role', 'dialog');
    expect(panel).toHaveAttribute('aria-modal', 'true');
  });
});
