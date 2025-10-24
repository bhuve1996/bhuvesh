describe('Component System E2E Tests', () => {
  beforeEach(() => {
    // Visit a test page that includes all our components
    cy.visit('/test-components');
  });

  describe('Button Component', () => {
    it('should render and handle clicks', () => {
      cy.get('[data-testid="test-button"]').should('be.visible');
      cy.get('[data-testid="test-button"]').click();
      cy.get('[data-testid="click-count"]').should('contain', '1');
    });

    it('should handle different variants', () => {
      cy.get('[data-testid="primary-button"]').should(
        'have.class',
        'bg-primary-500'
      );
      cy.get('[data-testid="secondary-button"]').should(
        'have.class',
        'bg-secondary-500'
      );
      cy.get('[data-testid="outline-button"]').should(
        'have.class',
        'border-primary-500'
      );
    });

    it('should handle loading state', () => {
      cy.get('[data-testid="loading-button"]').should('be.disabled');
      cy.get('[data-testid="loading-button"]').should(
        'have.attr',
        'aria-busy',
        'true'
      );
    });

    it('should handle disabled state', () => {
      cy.get('[data-testid="disabled-button"]').should('be.disabled');
      cy.get('[data-testid="disabled-button"]').should(
        'have.attr',
        'aria-disabled',
        'true'
      );
    });
  });

  describe('FormField Component', () => {
    it('should render with label and input', () => {
      cy.get('[data-testid="form-field"]').should('be.visible');
      cy.get('[data-testid="form-field"] label').should(
        'contain',
        'Test Field'
      );
      cy.get('[data-testid="form-field"] input').should('be.visible');
    });

    it('should show required indicator', () => {
      cy.get('[data-testid="required-field"] label').should('contain', '*');
      cy.get('[data-testid="required-field"] [aria-label="required"]').should(
        'exist'
      );
    });

    it('should show help text', () => {
      cy.get('[data-testid="help-field"]').should(
        'contain',
        'This is help text'
      );
    });

    it('should show error message', () => {
      cy.get('[data-testid="error-field"]').should(
        'contain',
        'This is an error'
      );
      cy.get('[data-testid="error-field"] [role="alert"]').should('exist');
    });

    it('should have proper label association', () => {
      cy.get('[data-testid="form-field"] label').then($label => {
        const forAttr = $label.attr('for');
        cy.get(`#${forAttr}`).should('exist');
      });
    });
  });

  describe('StatusBadge Component', () => {
    it('should render with different statuses', () => {
      cy.get('[data-testid="success-badge"]').should(
        'have.class',
        'bg-success-50'
      );
      cy.get('[data-testid="error-badge"]').should('have.class', 'bg-error-50');
      cy.get('[data-testid="warning-badge"]').should(
        'have.class',
        'bg-warning-50'
      );
      cy.get('[data-testid="info-badge"]').should(
        'have.class',
        'bg-primary-50'
      );
    });

    it('should render with different variants', () => {
      cy.get('[data-testid="solid-badge"]').should(
        'have.class',
        'bg-success-500'
      );
      cy.get('[data-testid="outline-badge"]').should(
        'have.class',
        'border-success-500'
      );
      cy.get('[data-testid="soft-badge"]').should(
        'have.class',
        'bg-success-50'
      );
    });

    it('should render with icons', () => {
      cy.get('[data-testid="icon-badge"]').should('contain', '✅');
    });
  });

  describe('FileUpload Component', () => {
    it('should render upload area', () => {
      cy.get('[data-testid="file-upload"]').should('be.visible');
      cy.get('[data-testid="file-upload"]').should(
        'contain',
        'Drag and drop your files here'
      );
    });

    it('should handle file selection', () => {
      const fileName = 'test-resume.pdf';
      cy.get('[data-testid="file-upload"] input[type="file"]').selectFile({
        contents: 'test content',
        fileName,
        mimeType: 'application/pdf',
      });

      cy.get('[data-testid="file-upload"]').should('contain', fileName);
      cy.get('[data-testid="file-upload"]').should('contain', 'Upload 1 file');
    });

    it('should handle drag and drop', () => {
      const fileName = 'test-resume.pdf';

      cy.get('[data-testid="file-upload"]').trigger('dragenter');
      cy.get('[data-testid="file-upload"]').should(
        'have.class',
        'border-cyan-500'
      );

      cy.get('[data-testid="file-upload"]').trigger('drop', {
        dataTransfer: {
          files: [
            new File(['test content'], fileName, { type: 'application/pdf' }),
          ],
        },
      });

      cy.get('[data-testid="file-upload"]').should('contain', fileName);
    });

    it('should validate file size', () => {
      // Create a large file (simulate)
      cy.get('[data-testid="file-upload"] input[type="file"]').then($input => {
        const file = new File(
          ['x'.repeat(11 * 1024 * 1024)],
          'large-file.pdf',
          { type: 'application/pdf' }
        );
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        $input[0].files = dataTransfer.files;
        $input.trigger('change');
      });

      cy.get('[data-testid="file-upload"]').should(
        'contain',
        'File size exceeds'
      );
    });

    it('should validate file type', () => {
      cy.get('[data-testid="file-upload"] input[type="file"]').selectFile({
        contents: 'test content',
        fileName: 'test.txt',
        mimeType: 'text/plain',
      });

      cy.get('[data-testid="file-upload"]').should(
        'contain',
        'File type .txt is not allowed'
      );
    });
  });

  describe('FloatingPanel Component', () => {
    it('should show floating action button initially', () => {
      cy.get('[data-testid="floating-panel"]').should('be.visible');
      cy.get('[data-testid="floating-panel"]').should(
        'contain',
        'Quick Actions'
      );
    });

    it('should open panel when clicked', () => {
      cy.get('[data-testid="floating-panel"] button').first().click();
      cy.get('[data-testid="floating-panel"]').should(
        'contain',
        'Resume Tools'
      );
      cy.get('[data-testid="floating-panel"]').should(
        'contain',
        'ATS Analysis'
      );
    });

    it('should switch between tabs', () => {
      cy.get('[data-testid="floating-panel"] button').first().click();

      cy.get('[data-testid="floating-panel"]').should(
        'contain',
        'ATS Analysis'
      );
      cy.get('[data-testid="floating-panel"]').contains('AI Content').click();
      cy.get('[data-testid="floating-panel"]').should('contain', 'AI Content');

      cy.get('[data-testid="floating-panel"]').contains('Customize').click();
      cy.get('[data-testid="floating-panel"]').should('contain', 'Customize');
    });

    it('should expand and collapse', () => {
      cy.get('[data-testid="floating-panel"] button').first().click();

      // Check default size
      cy.get('[data-testid="floating-panel"] .panel-content').should(
        'have.class',
        'w-80'
      );

      // Expand
      cy.get('[data-testid="floating-panel"]').contains('Expand').click();
      cy.get('[data-testid="floating-panel"] .panel-content').should(
        'have.class',
        'w-96'
      );

      // Collapse
      cy.get('[data-testid="floating-panel"]').contains('Collapse').click();
      cy.get('[data-testid="floating-panel"] .panel-content').should(
        'have.class',
        'w-80'
      );
    });

    it('should close panel', () => {
      cy.get('[data-testid="floating-panel"] button').first().click();
      cy.get('[data-testid="floating-panel"]').should(
        'contain',
        'Resume Tools'
      );

      cy.get('[data-testid="floating-panel"]').contains('Close').click();
      cy.get('[data-testid="floating-panel"]').should(
        'contain',
        'Quick Actions'
      );
    });
  });

  describe('Component Integration', () => {
    it('should handle complete form workflow', () => {
      // Fill form
      cy.get('[data-testid="name-input"]').type('John Doe');
      cy.get('[data-testid="email-input"]').type('john@example.com');

      // Upload file
      cy.get('[data-testid="file-upload"] input[type="file"]').selectFile({
        contents: 'test content',
        fileName: 'resume.pdf',
        mimeType: 'application/pdf',
      });

      // Submit form
      cy.get('[data-testid="submit-button"]').click();

      // Check success state
      cy.get('[data-testid="success-badge"]').should('be.visible');
      cy.get('[data-testid="success-badge"]').should(
        'contain',
        'Form submitted successfully'
      );
    });

    it('should handle error states', () => {
      // Submit form without required fields
      cy.get('[data-testid="submit-button"]').click();

      // Check error states
      cy.get('[data-testid="name-field"]').should(
        'contain',
        'This field is required'
      );
      cy.get('[data-testid="email-field"]').should(
        'contain',
        'This field is required'
      );
    });

    it('should handle loading states', () => {
      // Fill form
      cy.get('[data-testid="name-input"]').type('John Doe');
      cy.get('[data-testid="email-input"]').type('john@example.com');

      // Submit form
      cy.get('[data-testid="submit-button"]').click();

      // Check loading state
      cy.get('[data-testid="submit-button"]').should('be.disabled');
      cy.get('[data-testid="submit-button"]').should(
        'contain',
        'Submitting...'
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      // Button accessibility
      cy.get('[data-testid="test-button"]').should(
        'have.attr',
        'aria-disabled'
      );
      cy.get('[data-testid="loading-button"]').should(
        'have.attr',
        'aria-busy',
        'true'
      );

      // Form accessibility
      cy.get('[data-testid="form-field"] label').should('have.attr', 'for');
      cy.get('[data-testid="error-field"] [role="alert"]').should('exist');

      // Panel accessibility
      cy.get('[data-testid="floating-panel"] button').first().click();
      cy.get('[data-testid="floating-panel"] .panel-content').should(
        'have.attr',
        'role',
        'dialog'
      );
    });

    it('should support keyboard navigation', () => {
      // Tab navigation
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'test-button');

      cy.focused().tab();
      cy.focused().should('have.attr', 'data-testid', 'name-input');

      // Enter key activation
      cy.get('[data-testid="test-button"]').focus();
      cy.get('[data-testid="test-button"]').type('{enter}');
      cy.get('[data-testid="click-count"]').should('contain', '1');
    });

    it('should have proper focus management', () => {
      cy.get('[data-testid="floating-panel"] button').first().click();

      // Focus should be managed properly in the panel
      cy.get('[data-testid="floating-panel"] .panel-content').should(
        'be.visible'
      );
      cy.get('[data-testid="floating-panel"] .panel-content button')
        .first()
        .should('be.focused');
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile devices', () => {
      cy.viewport(375, 667); // iPhone SE

      cy.get('[data-testid="floating-panel"]').should('be.visible');
      cy.get('[data-testid="floating-panel"] button').first().click();

      // Panel should be responsive
      cy.get('[data-testid="floating-panel"] .panel-content').should(
        'be.visible'
      );
    });

    it('should work on tablet devices', () => {
      cy.viewport(768, 1024); // iPad

      cy.get('[data-testid="floating-panel"]').should('be.visible');
      cy.get('[data-testid="floating-panel"] button').first().click();

      // Panel should be responsive
      cy.get('[data-testid="floating-panel"] .panel-content').should(
        'be.visible'
      );
    });
  });
});
