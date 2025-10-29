/**
 * Mobile device detection and adaptive configuration utilities
 * Helps optimize file upload behavior for mobile devices
 */

// NetworkInformation interface for connection detection
interface NetworkInformation {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

// Extend Navigator interface
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

export interface MobileConfig {
  isMobile: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  isChrome: boolean;
  isMobileChrome: boolean;
  hasTouch: boolean;
  connectionType: 'slow' | 'fast' | 'unknown';
  recommendedTimeout: number;
  recommendedMaxSize: number;
  supportsDragDrop: boolean;
}

/**
 * Detect if the current device is mobile
 */
export function detectMobileDevice(): MobileConfig {
  // Return default config if running on server
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isMobile: false,
      isAndroid: false,
      isIOS: false,
      isChrome: false,
      isMobileChrome: false,
      hasTouch: false,
      connectionType: 'unknown',
      recommendedTimeout: 60000,
      recommendedMaxSize: 10 * 1024 * 1024,
      supportsDragDrop: true,
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);
  const isChrome = /chrome/i.test(userAgent) && !/edge/i.test(userAgent);
  const isMobileChrome = isMobile && isChrome;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Detect connection type (if available)
  const connection =
    (navigator as NavigatorWithConnection).connection ||
    (navigator as NavigatorWithConnection).mozConnection ||
    (navigator as NavigatorWithConnection).webkitConnection;
  let connectionType: 'slow' | 'fast' | 'unknown' = 'unknown';

  if (connection) {
    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      connectionType = 'slow';
    } else if (effectiveType === '3g' || effectiveType === '4g') {
      connectionType = 'fast';
    }
  }

  // Calculate recommended settings based on device capabilities
  const recommendedTimeout = isMobileChrome ? 120000 : 60000; // 2 minutes for mobile Chrome
  const recommendedMaxSize = isMobile ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for mobile, 10MB for desktop
  const supportsDragDrop = !isMobile; // Mobile devices don't support drag & drop

  return {
    isMobile,
    isAndroid,
    isIOS,
    isChrome,
    isMobileChrome,
    hasTouch,
    connectionType,
    recommendedTimeout,
    recommendedMaxSize,
    supportsDragDrop,
  };
}

/**
 * Get adaptive configuration for file uploads based on device
 */
export function getAdaptiveUploadConfig(): {
  timeout: number;
  maxSize: number;
  retries: number;
  retryDelay: number;
  useChunkedUpload: boolean;
} {
  const mobileConfig = detectMobileDevice();

  return {
    timeout: mobileConfig.recommendedTimeout,
    maxSize: mobileConfig.recommendedMaxSize,
    retries: mobileConfig.isMobileChrome ? 5 : 3, // More retries for mobile Chrome
    retryDelay: mobileConfig.isMobileChrome ? 2000 : 1000, // Longer delays for mobile
    useChunkedUpload:
      mobileConfig.isMobile && mobileConfig.connectionType === 'slow',
  };
}

/**
 * Check if the current environment has known mobile Chrome issues
 */
export function hasMobileChromeIssues(): boolean {
  const config = detectMobileDevice();
  return config.isMobileChrome && config.isAndroid;
}

/**
 * Get user-friendly error messages for mobile-specific issues
 */
export function getMobileErrorMessage(error: Error): string {
  const config = detectMobileDevice();

  if (!config.isMobile) {
    return error.message;
  }

  // Mobile-specific error messages
  if (error.message.includes('ERR_UPLOAD_FILE_CHANGED')) {
    return 'File access issue on mobile. Please try selecting the file again or use a different file.';
  }

  if (error.message.includes('NotReadableError')) {
    return 'Unable to read file on mobile device. Please ensure the file is not open in another app.';
  }

  if (error.message.includes('timeout')) {
    return 'Upload timed out on mobile connection. Please check your internet connection and try again.';
  }

  if (error.message.includes('NetworkError')) {
    return 'Network error on mobile device. Please check your connection and try again.';
  }

  return error.message;
}

/**
 * Log mobile-specific debugging information
 */
export function logMobileDebugInfo(
  _context: string,
  _additionalInfo?: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === 'development') {
    // Debug logging disabled in production
    // const config = detectMobileDevice();
    // console.log(`[Mobile Debug - ${context}]`, {
    //   ...config,
    //   ...additionalInfo,
    //   userAgent: navigator.userAgent,
    //   screenSize: `${window.screen.width}x${window.screen.height}`,
    //   viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    // });
  }
}
