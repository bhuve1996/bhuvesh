// ============================================================================
// ACCESSIBILITY UTILITIES - Centralized accessibility helpers
// ============================================================================

/**
 * Generate unique IDs for accessibility attributes
 */
let idCounter = 0;
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${++idCounter}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create ARIA-describedby attribute value
 */
export const createAriaDescribedBy = (
  errorId?: string,
  helpId?: string,
  descriptionId?: string
): string | undefined => {
  const ids = [errorId, helpId, descriptionId].filter(Boolean);
  return ids.length > 0 ? ids.join(' ') : undefined;
};

/**
 * Create ARIA-labelledby attribute value
 */
export const createAriaLabelledBy = (
  labelId?: string,
  requiredId?: string
): string | undefined => {
  const ids = [labelId, requiredId].filter(Boolean);
  return ids.length > 0 ? ids.join(' ') : undefined;
};

/**
 * Get appropriate ARIA live region politeness
 */
export const getAriaLivePoliteness = (
  type: 'error' | 'success' | 'info' | 'warning'
): 'polite' | 'assertive' => {
  return type === 'error' ? 'assertive' : 'polite';
};

/**
 * Get appropriate ARIA role for status messages
 */
export const getAriaRole = (
  type: 'error' | 'success' | 'info' | 'warning'
): 'alert' | 'status' => {
  return type === 'error' ? 'alert' : 'status';
};

/**
 * Create keyboard navigation handlers
 */
export const createKeyboardHandlers = (handlers: {
  onEnter?: () => void;
  onSpace?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: () => void;
  onShiftTab?: () => void;
}) => {
  return (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        handlers.onEnter?.();
        break;
      case ' ':
        event.preventDefault();
        handlers.onSpace?.();
        break;
      case 'Escape':
        event.preventDefault();
        handlers.onEscape?.();
        break;
      case 'ArrowUp':
        event.preventDefault();
        handlers.onArrowUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        handlers.onArrowDown?.();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        handlers.onArrowLeft?.();
        break;
      case 'ArrowRight':
        event.preventDefault();
        handlers.onArrowRight?.();
        break;
      case 'Tab':
        if (event.shiftKey) {
          handlers.onShiftTab?.();
        } else {
          handlers.onTab?.();
        }
        break;
    }
  };
};

/**
 * Create focus trap for modals and panels
 */
export const createFocusTrap = (
  containerRef: React.RefObject<HTMLElement>,
  onEscape?: () => void
) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onEscape?.();
      return;
    }

    if (event.key === 'Tab') {
      const container = containerRef.current;
      if (!container) return;

      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
  };

  return handleKeyDown;
};

/**
 * Get appropriate heading level
 */
export const getHeadingLevel = (level: number): `h${1 | 2 | 3 | 4 | 5 | 6}` => {
  const clampedLevel = Math.max(1, Math.min(6, level));
  return `h${clampedLevel}` as `h${1 | 2 | 3 | 4 | 5 | 6}`;
};

/**
 * Create screen reader only text
 */
export const createScreenReaderText = (text: string): string => {
  return text;
};

/**
 * Get appropriate color contrast ratio
 */
export const getColorContrast = (
  _foreground: string,
  _background: string
): number => {
  // This is a simplified version - in production, you'd use a proper color contrast library
  // For now, we'll return a mock value
  return 4.5; // WCAG AA compliant
};

/**
 * Validate ARIA attributes
 */
export const validateAriaAttributes = (
  attributes: Record<string, unknown>
): string[] => {
  const errors: string[] = [];

  // Check for required ARIA attributes
  if (attributes['aria-label'] && attributes['aria-labelledby']) {
    errors.push('Cannot have both aria-label and aria-labelledby');
  }

  if (attributes['aria-describedby'] && attributes['aria-description']) {
    errors.push('Cannot have both aria-describedby and aria-description');
  }

  // Check for valid ARIA values
  if (
    attributes['aria-expanded'] &&
    !['true', 'false'].includes(attributes['aria-expanded'] as string)
  ) {
    errors.push('aria-expanded must be "true" or "false"');
  }

  if (
    attributes['aria-selected'] &&
    !['true', 'false'].includes(attributes['aria-selected'] as string)
  ) {
    errors.push('aria-selected must be "true" or "false"');
  }

  if (
    attributes['aria-checked'] &&
    !['true', 'false', 'mixed'].includes(attributes['aria-checked'] as string)
  ) {
    errors.push('aria-checked must be "true", "false", or "mixed"');
  }

  return errors;
};

/**
 * Create accessible button props
 */
export const createAccessibleButtonProps = (props: {
  disabled?: boolean;
  loading?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  controls?: string;
  describedBy?: string;
  label?: string;
}) => {
  const {
    disabled = false,
    loading = false,
    pressed,
    expanded,
    controls,
    describedBy,
    label,
  } = props;

  const accessibleProps: Record<string, unknown> = {
    'aria-disabled': disabled || loading,
    'aria-busy': loading,
  };

  if (pressed !== undefined) {
    accessibleProps['aria-pressed'] = pressed;
  }

  if (expanded !== undefined) {
    accessibleProps['aria-expanded'] = expanded;
  }

  if (controls) {
    accessibleProps['aria-controls'] = controls;
  }

  if (describedBy) {
    accessibleProps['aria-describedby'] = describedBy;
  }

  if (label) {
    accessibleProps['aria-label'] = label;
  }

  return accessibleProps;
};

/**
 * Create accessible form field props
 */
export const createAccessibleFormFieldProps = (props: {
  required?: boolean;
  invalid?: boolean;
  describedBy?: string;
  labelledBy?: string;
  label?: string;
}) => {
  const {
    required = false,
    invalid = false,
    describedBy,
    labelledBy,
    label,
  } = props;

  const accessibleProps: Record<string, unknown> = {
    'aria-required': required,
    'aria-invalid': invalid,
  };

  if (describedBy) {
    accessibleProps['aria-describedby'] = describedBy;
  }

  if (labelledBy) {
    accessibleProps['aria-labelledby'] = labelledBy;
  }

  if (label) {
    accessibleProps['aria-label'] = label;
  }

  return accessibleProps;
};

/**
 * Create accessible status message props
 */
export const createAccessibleStatusProps = (
  type: 'error' | 'success' | 'info' | 'warning',
  id?: string
) => {
  return {
    id,
    role: getAriaRole(type),
    'aria-live': getAriaLivePoliteness(type),
    'aria-atomic': 'true',
  };
};

/**
 * Create accessible list props
 */
export const createAccessibleListProps = (props: {
  orientation?: 'horizontal' | 'vertical';
  role?: 'list' | 'menu' | 'tablist' | 'toolbar';
  labelledBy?: string;
}) => {
  const { orientation = 'vertical', role = 'list', labelledBy } = props;

  const accessibleProps: Record<string, unknown> = {
    role,
  };

  if (orientation === 'horizontal') {
    accessibleProps['aria-orientation'] = 'horizontal';
  }

  if (labelledBy) {
    accessibleProps['aria-labelledby'] = labelledBy;
  }

  return accessibleProps;
};

/**
 * Create accessible tab props
 */
export const createAccessibleTabProps = (props: {
  selected?: boolean;
  controls?: string;
  labelledBy?: string;
  describedBy?: string;
}) => {
  const { selected = false, controls, labelledBy, describedBy } = props;

  const accessibleProps: Record<string, unknown> = {
    role: 'tab',
    'aria-selected': selected,
    tabIndex: selected ? 0 : -1,
  };

  if (controls) {
    accessibleProps['aria-controls'] = controls;
  }

  if (labelledBy) {
    accessibleProps['aria-labelledby'] = labelledBy;
  }

  if (describedBy) {
    accessibleProps['aria-describedby'] = describedBy;
  }

  return accessibleProps;
};

/**
 * Create accessible tabpanel props
 */
export const createAccessibleTabPanelProps = (props: {
  labelledBy?: string;
  describedBy?: string;
}) => {
  const { labelledBy, describedBy } = props;

  const accessibleProps: Record<string, unknown> = {
    role: 'tabpanel',
  };

  if (labelledBy) {
    accessibleProps['aria-labelledby'] = labelledBy;
  }

  if (describedBy) {
    accessibleProps['aria-describedby'] = describedBy;
  }

  return accessibleProps;
};
