// UI Component Types
export interface ButtonProps {
  children: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'default';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: (() => void) | undefined;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  title?: string; // Add missing title property
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  subMessage?: string;
}

export interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'active' | 'current' | 'completed' | 'error';
  icon?: string;
}

export interface ProgressStepsProps {
  steps: ProgressStep[];
  currentStep: number;
  className?: string;
}

export interface SVGProps {
  name?: string;
  size?: number;
  className?: string;
  color?: string;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  viewBox?: string;
}

export interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  background?: 'transparent' | 'gradient' | 'dark';
  showSeparator?: boolean;
  separatorVariant?: 'line' | 'gradient' | 'dots' | 'shadow';
  separatorColor?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'muted';
}

export interface ToastOptions {
  duration?: number;
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
}

export type ToastType = 'success' | 'error' | 'loading' | 'info';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

// Enhanced Card Props with animation support
export interface EnhancedCardProps extends CardProps {
  delay?: number;
  onClick?: () => void; // Add missing onClick property
  role?: string;
  tabIndex?: number;
  'aria-pressed'?: boolean;
  'aria-label'?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

// Animated Score Component Types
export interface AnimatedScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGrade?: boolean;
  className?: string;
}

// Data Visualization Component Types
export interface DataVisualizationItem {
  label: string;
  value: number;
  color?: string;
  icon?: string;
}

export interface DataVisualizationProps {
  title: string;
  data: DataVisualizationItem[];
  type?: 'bar' | 'radial' | 'donut';
  className?: string;
}

// Animated Progress Component Types
export interface AnimatedProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

export interface AnimatedProgressProps {
  steps: ProgressStep[];
  currentStep: number;
  className?: string;
}

// Tab Component Types
export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeTab?: string;
  defaultActiveTab?: string;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
  onTabChange?: (tabId: string) => void;
}
