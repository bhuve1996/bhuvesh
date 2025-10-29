/**
 * User Session Management
 *
 * Creates unique session IDs for each browser session to ensure
 * data isolation between different users or sessions.
 *
 * - Each browser tab/window gets a unique session ID
 * - Session ID is stored in sessionStorage (cleared when tab closes)
 * - For authenticated users, uses their user ID
 * - For anonymous users, generates a unique session ID
 */

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get or create a session ID for the current browser session
 * Uses sessionStorage so each tab gets its own isolated session
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return 'server-session';
  }

  const sessionKey = 'user-session-id';

  // Check if we already have a session ID in sessionStorage
  let sessionId = sessionStorage.getItem(sessionKey);

  if (!sessionId) {
    // Generate a new session ID
    sessionId = generateSessionId();
    sessionStorage.setItem(sessionKey, sessionId);
  }

  return sessionId;
}

/**
 * Get a storage key prefixed with the current session ID
 * This ensures data isolation between different sessions/users
 */
export function getSessionStorageKey(baseKey: string): string {
  const sessionId = getSessionId();
  return `${sessionId}:${baseKey}`;
}

/**
 * Clear all session-specific data
 * Removes all localStorage items that belong to this session
 */
export function clearSessionData(): void {
  if (typeof window === 'undefined') return;

  const sessionId = getSessionId();
  const prefix = `${sessionId}:`;

  // Remove all localStorage items with this session prefix
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));

  // Clear sessionStorage session ID (will be regenerated on next access)
  sessionStorage.removeItem('user-session-id');
}

/**
 * Get all session-specific storage keys
 */
export function getSessionStorageKeys(): string[] {
  if (typeof window === 'undefined') return [];

  const sessionId = getSessionId();
  const prefix = `${sessionId}:`;
  const keys: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keys.push(key);
    }
  }

  return keys;
}

/**
 * Check if a storage key belongs to the current session
 */
export function isSessionKey(key: string): boolean {
  if (typeof window === 'undefined') return false;

  const sessionId = getSessionId();
  return key.startsWith(`${sessionId}:`);
}
