/**
 * Analytics Debugger Component
 * Development tool for viewing analytics events in real-time
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { analytics } from '@/lib/analytics/analytics';
import { analyticsConfig } from '@/lib/analytics/config';

export interface AnalyticsDebuggerProps {
  enabled?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxEvents?: number;
}

export function AnalyticsDebugger({
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  maxEvents = 50,
}: AnalyticsDebuggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [session, setSession] = useState(analytics.getSession());

  useEffect(() => {
    if (!enabled || !analyticsConfig.customEvents.debug) return;

    // Override console.log to capture analytics events
    const originalLog = console.log;
    console.log = (...args) => {
      if (
        args[0]?.includes?.('[Analytics]') ||
        args[0]?.includes?.('Analytics Event:')
      ) {
        const eventData = args[1] || args[0];
        setEvents(prev => [
          {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            data: eventData,
            type: 'event',
          },
          ...prev.slice(0, maxEvents - 1),
        ]);
      }
      originalLog(...args);
    };

    return () => {
      console.log = originalLog;
    };
  }, [enabled, maxEvents]);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setSession(analytics.getSession());
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled || !analyticsConfig.customEvents.debug) {
    return null;
  }

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-[9999]`}>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className='bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors'
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className='flex items-center space-x-2'>
          <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
          <span className='text-sm font-medium'>Analytics</span>
          {events.length > 0 && (
            <span className='bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center'>
              {events.length}
            </span>
          )}
        </div>
      </motion.button>

      {/* Debug Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className='absolute bottom-16 right-0 w-96 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-hidden'
          >
            <div className='p-4 border-b border-gray-200'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-gray-800'>
                  Analytics Debugger
                </h3>
                <button
                  onClick={() => setEvents([])}
                  className='text-sm text-gray-500 hover:text-gray-700'
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Session Info */}
            <div className='p-4 border-b border-gray-200 bg-gray-50'>
              <h4 className='text-sm font-medium text-gray-700 mb-2'>
                Session Info
              </h4>
              <div className='text-xs space-y-1'>
                <div>Session ID: {session.session_id}</div>
                <div>Page Views: {session.page_views}</div>
                <div>Events: {session.events}</div>
                <div>
                  Time: {Math.round((Date.now() - session.start_time) / 1000)}s
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className='max-h-64 overflow-y-auto'>
              {events.length === 0 ? (
                <div className='p-4 text-center text-gray-500 text-sm'>
                  No events tracked yet
                </div>
              ) : (
                <div className='space-y-2 p-2'>
                  {events.map(event => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className='bg-gray-50 p-3 rounded border-l-4 border-blue-500'
                    >
                      <div className='text-xs text-gray-500 mb-1'>
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                      <div className='text-sm font-medium text-gray-800'>
                        {event.data?.event_name ||
                          event.data?.event ||
                          'Unknown Event'}
                      </div>
                      {event.data?.event_category && (
                        <div className='text-xs text-gray-600'>
                          Category: {event.data.event_category}
                        </div>
                      )}
                      {event.data?.event_label && (
                        <div className='text-xs text-gray-600'>
                          Label: {event.data.event_label}
                        </div>
                      )}
                      {event.data?.custom_parameters && (
                        <details className='mt-2'>
                          <summary className='text-xs text-gray-500 cursor-pointer'>
                            Parameters
                          </summary>
                          <pre className='text-xs text-gray-600 mt-1 overflow-x-auto'>
                            {JSON.stringify(
                              event.data.custom_parameters,
                              null,
                              2
                            )}
                          </pre>
                        </details>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className='p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500'>
              <div className='flex items-center justify-between'>
                <span>Analytics Debug Mode</span>
                <span>{analytics.getProviders().length} providers</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
