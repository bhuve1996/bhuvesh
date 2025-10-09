// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

import { ReactNode } from 'react';

// ============================================================================
// BASE COMPONENT PROPS
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface BaseButtonProps extends BaseComponentProps {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger'
    | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface BaseInputProps extends BaseComponentProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
}

// ============================================================================
// BUTTON COMPONENTS
// ============================================================================

export interface ButtonProps extends BaseButtonProps {
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  download?: boolean;
}

export interface IconButtonProps extends BaseComponentProps {
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  'aria-label': string;
}

// ============================================================================
// CARD COMPONENTS
// ============================================================================

export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export interface CardHeaderProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export interface CardContentProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface CardFooterProps extends BaseComponentProps {
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

// ============================================================================
// FORM COMPONENTS
// ============================================================================

export interface FormProps extends BaseComponentProps {
  onSubmit?: (data: Record<string, any>) => void;
  onReset?: () => void;
  initialValues?: Record<string, any>;
  validationSchema?: any;
  loading?: boolean;
}

export interface InputProps extends BaseInputProps {
  name?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
}

export interface TextareaProps extends BaseInputProps {
  name?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  autoComplete?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
}

export interface SelectProps extends BaseComponentProps {
  name?: string;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface CheckboxProps extends BaseComponentProps {
  name?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  indeterminate?: boolean;
}

export interface RadioProps extends BaseComponentProps {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  orientation?: 'horizontal' | 'vertical';
}

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

export interface SectionProps extends BaseComponentProps {
  id?: string;
  background?: 'default' | 'primary' | 'secondary' | 'accent' | 'transparent';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centered?: boolean;
}

export interface ContainerProps extends BaseComponentProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  fluid?: boolean;
}

export interface GridProps extends BaseComponentProps {
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

export interface FlexProps extends BaseComponentProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  flex?: string | number;
}

// ============================================================================
// NAVIGATION COMPONENTS
// ============================================================================

export interface NavigationProps extends BaseComponentProps {
  variant?: 'horizontal' | 'vertical' | 'sidebar';
  items: NavigationItem[];
  activeItem?: string;
  onItemClick?: (item: NavigationItem) => void;
  logo?: ReactNode;
  user?: {
    name: string;
    avatar?: string;
    email?: string;
  };
  actions?: ReactNode;
}

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  children?: NavigationItem[];
  onClick?: () => void;
}

export interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  maxItems?: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// ============================================================================
// FEEDBACK COMPONENTS
// ============================================================================

export interface AlertProps extends BaseComponentProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: ReactNode;
}

export interface ToastProps extends BaseComponentProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  icon?: ReactNode;
  duration?: number;
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  onClose?: () => void;
  action?: ReactNode;
}

export interface LoadingProps extends BaseComponentProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  overlay?: boolean;
}

export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animated?: boolean;
  striped?: boolean;
}

export interface ProgressStepProps extends BaseComponentProps {
  steps: ProgressStep[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'minimal' | 'detailed';
}

export interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  status: 'pending' | 'active' | 'completed' | 'error';
  duration?: number;
}

// ============================================================================
// DATA DISPLAY COMPONENTS
// ============================================================================

export interface TableProps extends BaseComponentProps {
  data: Record<string, any>[];
  columns: TableColumn[];
  loading?: boolean;
  empty?: ReactNode;
  pagination?: PaginationProps;
  sorting?: SortingProps;
  selection?: SelectionProps;
  actions?: TableAction[];
}

export interface TableColumn {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (
    value: any,
    record: Record<string, any>,
    index: number
  ) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface TableAction {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: (record: Record<string, any>) => void;
  disabled?: (record: Record<string, any>) => boolean;
  variant?: 'default' | 'primary' | 'danger';
}

export interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
}

export interface SortingProps {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export interface SelectionProps {
  selectedRowKeys: string[];
  onSelectionChange: (
    selectedRowKeys: string[],
    selectedRows: Record<string, any>[]
  ) => void;
  type?: 'checkbox' | 'radio';
}

export interface BadgeProps extends BaseComponentProps {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  count?: number;
  max?: number;
  showZero?: boolean;
}

export interface TagProps extends BaseComponentProps {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info';
  size?: 'sm' | 'md' | 'lg';
  closable?: boolean;
  onClose?: () => void;
  color?: string;
}

export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  fallback?: ReactNode;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

// ============================================================================
// OVERLAY COMPONENTS
// ============================================================================

export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  maskClosable?: boolean;
  footer?: ReactNode;
  loading?: boolean;
}

export interface DrawerProps extends BaseComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  maskClosable?: boolean;
  footer?: ReactNode;
}

export interface PopoverProps extends BaseComponentProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  content: ReactNode;
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end';
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  disabled?: boolean;
}

export interface TooltipProps extends BaseComponentProps {
  content: ReactNode;
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end';
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  disabled?: boolean;
  delay?: number;
}

// ============================================================================
// FILE UPLOAD COMPONENTS
// ============================================================================

export interface FileUploadProps extends BaseComponentProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onUpload: (files: File[]) => void;
  onError?: (error: string) => void;
  loading?: boolean;
  disabled?: boolean;
  dragAndDrop?: boolean;
  preview?: boolean;
  validation?: {
    allowedTypes?: string[];
    maxSize?: number;
    minSize?: number;
    custom?: (file: File) => string | null;
  };
}

export interface FilePreviewProps extends BaseComponentProps {
  file: File;
  onRemove?: () => void;
  showSize?: boolean;
  showType?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

// ============================================================================
// CHART COMPONENTS
// ============================================================================

export interface ChartProps extends BaseComponentProps {
  data: any;
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polar' | 'scatter';
  options?: any;
  height?: number;
  width?: number;
  responsive?: boolean;
  loading?: boolean;
}

// ============================================================================
// THEME TYPES
// ============================================================================

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}
