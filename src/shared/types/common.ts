// ============================================================================
// COMMON TYPES
// ============================================================================

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// ============================================================================
// STATUS TYPES
// ============================================================================

export type Status = 'idle' | 'loading' | 'success' | 'error';
export type LoadingState = 'idle' | 'pending' | 'fulfilled' | 'rejected';
export type AsyncState<T> = {
  data: T | null;
  status: LoadingState;
  error: string | null;
  lastUpdated?: Date;
};

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage?: number;
  prevPage?: number;
}

export interface PaginatedData<T> {
  data: T[];
  meta: PaginationMeta;
}

// ============================================================================
// SORTING TYPES
// ============================================================================

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SortableField {
  key: string;
  label: string;
  sortable: boolean;
  defaultDirection?: 'asc' | 'desc';
}

// ============================================================================
// FILTERING TYPES
// ============================================================================

export interface FilterParams {
  field: string;
  operator:
    | 'eq'
    | 'ne'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in'
    | 'nin'
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'regex';
  value: any;
}

export interface FilterOption {
  label: string;
  value: any;
  count?: number;
  disabled?: boolean;
}

export interface FilterGroup {
  field: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date' | 'text' | 'boolean';
  options?: FilterOption[];
  multiple?: boolean;
  required?: boolean;
}

// ============================================================================
// SEARCH TYPES
// ============================================================================

export interface SearchParams {
  query: string;
  fields?: string[];
  filters?: FilterParams[];
  sort?: SortParams;
  pagination?: PaginationParams;
}

export interface SearchResult<T> {
  data: T[];
  total: number;
  query: string;
  suggestions?: string[];
  facets?: Record<string, FilterOption[]>;
  meta: PaginationMeta;
}

// ============================================================================
// DATE TYPES
// ============================================================================

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DateFilter {
  field: string;
  range: DateRange;
  granularity?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

// ============================================================================
// LOCATION TYPES
// ============================================================================

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timezone?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  formatted?: string;
}

// ============================================================================
// CONTACT TYPES
// ============================================================================

export interface Contact {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  location?: Location;
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  persistent?: boolean;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface Event {
  id: string;
  type: string;
  timestamp: Date;
  source: string;
  data: any;
  metadata?: Record<string, any>;
}

export interface EventHandler<T = any> {
  (event: Event & { data: T }): void | Promise<void>;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  features: Record<string, boolean>;
  limits: {
    maxFileSize: number;
    maxUploads: number;
    maxAnalysisPerDay: number;
  };
  analytics: {
    enabled: boolean;
    trackingId?: string;
  };
  monitoring: {
    enabled: boolean;
    endpoint?: string;
  };
}

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
  rollout?: {
    percentage: number;
    users?: string[];
    groups?: string[];
  };
  metadata?: Record<string, any>;
}

// ============================================================================
// PERMISSIONS
// ============================================================================

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  inherited?: string[];
}

// ============================================================================
// AUDIT TYPES
// ============================================================================

export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string;
  userId: string;
  timestamp: Date;
  changes?: Record<string, { from: any; to: any }>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// ============================================================================
// METADATA TYPES
// ============================================================================

export interface Metadata {
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  version: number;
  tags?: string[];
  category?: string;
  description?: string;
  custom?: Record<string, any>;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationRule {
  field: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  condition?: (value: any) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationRule[];
  warnings: ValidationRule[];
  score: number;
}

// ============================================================================
// CACHE TYPES
// ============================================================================

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
  lastAccessed: number;
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  evictions: number;
  memoryUsage: number;
}

// ============================================================================
// PERFORMANCE TYPES
// ============================================================================

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

export interface PerformanceProfile {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  metrics: PerformanceMetric[];
  breakdown: Record<string, number>;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface AppError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
  timestamp: Date;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: AppError;
  errorInfo?: any;
}

// ============================================================================
// THEME TYPES
// ============================================================================

export interface Theme {
  name: string;
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
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, number>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  breakpoints: Record<string, string>;
}

// ============================================================================
// LOCALIZATION TYPES
// ============================================================================

export interface Locale {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
    currency: string;
  };
}

export interface Translation {
  key: string;
  value: string;
  locale: string;
  namespace?: string;
  interpolation?: Record<string, any>;
}

// ============================================================================
// ACCESSIBILITY TYPES
// ============================================================================

export interface AccessibilityConfig {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
  ariaLabels: boolean;
  colorBlindSupport: boolean;
}

// ============================================================================
// DEVICE TYPES
// ============================================================================

export interface DeviceInfo {
  type: 'desktop' | 'tablet' | 'mobile';
  os: string;
  browser: string;
  version: string;
  screen: {
    width: number;
    height: number;
    density: number;
  };
  orientation: 'portrait' | 'landscape';
  touch: boolean;
  online: boolean;
}
