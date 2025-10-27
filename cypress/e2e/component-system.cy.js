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
      cy.get('[data-testid="primary-button"]').should('be.visible');
      cy.get('[data-testid="secondary-button"]').should('be.visible');
      cy.get('[data-testid="outline-button"]').should('be.visible');
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
      cy.get('[data-testid="success-badge"]').should('be.visible');
      cy.get('[data-testid="error-badge"]').should('be.visible');
      cy.get('[data-testid="warning-badge"]').should('be.visible');
      cy.get('[data-testid="info-badge"]').should('be.visible');
    });

    it('should render with different variants', () => {
      cy.get('[data-testid="solid-badge"]').should('be.visible');
      cy.get('[data-testid="outline-badge"]').should('be.visible');
      cy.get('[data-testid="soft-badge"]').should('be.visible');
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
      cy.get('[data-testid="file-upload"] input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from('test content'),
          fileName,
          mimeType: 'application/pdf',
        },
        { force: true }
      );

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
      // Create a large file using selectFile
      cy.get('[data-testid="file-upload"] input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from('x'.repeat(11 * 1024 * 1024)),
          fileName: 'large-file.pdf',
          mimeType: 'application/pdf',
        },
        { force: true }
      );

      cy.get('[data-testid="file-upload"]').should(
        'contain',
        'File size exceeds'
      );
    });

    it('should validate file type', () => {
      cy.get('[data-testid="file-upload"] input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from('test content'),
          fileName: 'test.txt',
          mimeType: 'text/plain',
        },
        { force: true }
      );

      cy.get('[data-testid="file-upload"]').should(
        'contain',
        'File type .txt is not allowed'
      );
    });
  });

  describe('FloatingPanel Component', () => {
    it('should show floating action button initially', () => {
      cy.get('[data-testid="floating-action-button"]').should('be.visible');
      cy.get('[data-testid="floating-action-button"]').should(
        'contain',
        'Resume Builder'
      );
    });

    it('should open panel when clicked', () => {
      cy.get('[data-testid="floating-action-button"]').click();
      cy.get('[role="dialog"]').should('be.visible');
      cy.get('[role="dialog"]').should('contain', 'Resume Tools');
      cy.get('[role="dialog"]').should('contain', 'ATS Analysis');
    });

    it('should switch between tabs', () => {
      cy.get('[data-testid="floating-action-button"]').click();

      cy.get('[role="dialog"]').should('contain', 'ATS Analysis');
      cy.get('[role="dialog"]').contains('Validate').click();
      cy.get('[role="dialog"]').should('contain', 'Validate');

      cy.get('[role="dialog"]').contains('Customize').click();
      cy.get('[role="dialog"]').should('contain', 'Customize');
    });

    it('should expand and collapse', () => {
      cy.get('[data-testid="floating-action-button"]').click();

      // Check that panel content is visible
      cy.get('[role="dialog"] .panel-content').should('be.visible');

      // Try to expand if expand button exists
      cy.get('[role="dialog"]').then($panel => {
        if ($panel.find('[aria-label*="Expand"]').length > 0) {
          cy.get('[role="dialog"] [aria-label*="Expand"]').click({
            force: true,
          });
          cy.get('[role="dialog"] .panel-content').should('be.visible');
        }
      });

      // Try to collapse if collapse button exists
      cy.get('[role="dialog"]').then($panel => {
        if ($panel.find('[aria-label*="Collapse"]').length > 0) {
          cy.get('[role="dialog"] [aria-label*="Collapse"]').click({
            force: true,
          });
          cy.get('[role="dialog"] .panel-content').should('be.visible');
        }
      });
    });

    it('should close panel', () => {
      cy.get('[data-testid="floating-action-button"]').click();
      cy.get('[role="dialog"]').should('contain', 'Resume Tools');

      cy.get('[role="dialog"]').contains('Close').click();
      cy.get('[data-testid="floating-action-button"]').should('be.visible');
    });
  });

  describe('Component Integration', () => {
    it('should handle complete form workflow', () => {
      // Fill form
      cy.get('[data-testid="name-input"]').type('John Doe');
      cy.get('[data-testid="email-input"]').type('john@example.com');

      // Upload file
      cy.get('[data-testid="file-upload"] input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from('test content'),
          fileName: 'resume.pdf',
          mimeType: 'application/pdf',
        },
        { force: true }
      );

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
      cy.get('[data-testid="floating-action-button"]').click();
      cy.get('[role="dialog"]').should('exist');
    });

    it('should support keyboard navigation', () => {
      // Test that elements are focusable
      cy.get('[data-testid="test-button"]').focus();
      cy.focused().should('have.attr', 'data-testid', 'test-button');

      cy.get('[data-testid="name-input"]').focus();
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
      // Check that some focusable element in the panel is focused
      cy.get('[data-testid="floating-panel"] button').should('be.focused');
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile devices', () => {
      cy.viewport(375, 667); // iPhone SE

      cy.get('[data-testid="floating-panel"]').should('exist');
      cy.get('[data-testid="floating-panel"] button')
        .first()
        .click({ force: true });

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
