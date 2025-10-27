'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { Card } from '@/components/ui/Card';
import type { PageBreaksTabProps } from '@/types';

export const PageBreaksTab: React.FC<PageBreaksTabProps> = ({
  resumeData: _resumeData,
  template: _template,
  resumeElement,
}) => {
  const [totalPages, setTotalPages] = useState(1);
  const [pageBreaks, setPageBreaks] = useState(0);
  const [showIndicators, setShowIndicators] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleIndicators = useCallback(() => {
    setShowIndicators(prev => !prev);

    // Toggle visibility of all page break indicators
    const indicators = document.querySelectorAll('.page-break-indicator');
    indicators.forEach(indicator => {
      const element = indicator as HTMLElement;
      element.style.display = showIndicators ? 'none' : 'block';
    });
  }, [showIndicators]);

  const addManualSpacingControls = useCallback((sections: Element[]) => {
    const controlsContainer = document.getElementById(
      'manual-spacing-controls'
    );
    if (!controlsContainer) return;

    // Clear existing controls
    controlsContainer.innerHTML = '';

    sections.forEach((section, index) => {
      const sectionElement = section as HTMLElement;
      const sectionTitle =
        sectionElement.querySelector('h1, h2, h3, h4, h5, h6')?.textContent ||
        `Section ${index + 1}`;

      const controlDiv = document.createElement('div');
      controlDiv.className =
        'flex items-center justify-between gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded border page-break-indicator-print-hidden';
      controlDiv.innerHTML = `
        <span class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate flex-1">${sectionTitle}</span>
        <div class="flex items-center gap-1">
          <button class="page-spacing-btn px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded border border-red-300" data-section="${index}" data-action="decrease">
            -
          </button>
          <span class="text-xs text-gray-600 dark:text-gray-400 min-w-[20px] text-center">0px</span>
          <button class="page-spacing-btn px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded border border-green-300" data-section="${index}" data-action="increase">
            +
          </button>
        </div>
      `;

      controlsContainer.appendChild(controlDiv);
    });

    // Add event listeners
    controlsContainer.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('page-spacing-btn')) {
        const sectionIndex = parseInt(target.dataset.section || '0');
        const action = target.dataset.action;
        const section = sections[sectionIndex] as HTMLElement;

        if (section) {
          const currentMargin = parseInt(section.style.marginBottom || '0');
          const newMargin =
            action === 'increase'
              ? currentMargin + 10
              : Math.max(0, currentMargin - 10);

          section.style.marginBottom = `${newMargin}px`;

          // Update the display
          const span = target.parentElement?.querySelector('span');
          if (span) {
            span.textContent = `${newMargin}px`;
          }

          // Trigger a custom event to recalculate page breaks
          window.dispatchEvent(new CustomEvent('recalculatePageBreaks'));
        }
      }
    });
  }, []);

  const calculatePageBreaks = useCallback(() => {
    if (!resumeElement) return;

    // Set position relative on the resume element
    (resumeElement as HTMLElement).style.position = 'relative';

    // Remove existing indicators
    const existingIndicators = resumeElement.querySelectorAll(
      '.page-break-indicator, .page-number-indicator'
    );
    existingIndicators.forEach(indicator => indicator.remove());

    // Apply smart page breaks
    const headings = resumeElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      let sectionElement = heading.parentElement;
      while (sectionElement && sectionElement !== resumeElement) {
        const className = sectionElement.className;
        if (
          className.includes('space-y') ||
          className.includes('mb-') ||
          className.includes('mt-') ||
          className.includes('p-') ||
          className.includes('px-') ||
          className.includes('py-')
        ) {
          break;
        }
        sectionElement = sectionElement.parentElement;
      }

      if (sectionElement) {
        sectionElement.classList.add('resume-section');
        sectionElement.classList.add('avoid-break');
      }
    });

    // Calculate and add page break indicators
    const sections = resumeElement.querySelectorAll('.resume-section');
    const sectionsArray = Array.from(sections);
    const breakPositions: { y: number; pageNumber: number }[] = [];
    // A4 page dimensions: 8.27" x 11.69" = 595 x 842 points
    // Use more conservative parameters for better page detection
    const pageHeightPoints = 842 - 18; // 824 points (0.25 inch margins)
    const pixelsToPoints = 0.5; // More conservative conversion factor

    let cumulativeHeightPoints = 0;
    let currentPageNum = 1;

    sectionsArray.forEach((section, index) => {
      const sectionHeightPoints =
        (section as HTMLElement).offsetHeight * pixelsToPoints;

      if (
        cumulativeHeightPoints + sectionHeightPoints > pageHeightPoints &&
        index > 0
      ) {
        breakPositions.push({
          y: (section as HTMLElement).offsetTop,
          pageNumber: currentPageNum + 1,
        });
        currentPageNum++;
        cumulativeHeightPoints = sectionHeightPoints;
      } else {
        cumulativeHeightPoints += sectionHeightPoints;
      }
    });

    // Add visual indicators
    breakPositions.forEach(breakPoint => {
      const indicator = document.createElement('div');
      indicator.className = 'page-break-indicator';
      indicator.style.cssText = `
        position: absolute;
        top: ${breakPoint.y}px;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #ef4444 0%, #f97316 50%, #ef4444 100%);
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
        border-radius: 2px;
      `;

      // Add print-specific class for hiding during print
      indicator.classList.add('page-break-indicator-print-hidden');

      // Set initial visibility based on showIndicators state
      if (!showIndicators) {
        indicator.style.display = 'none';
      }

      const label = document.createElement('div');
      label.textContent = `Page ${breakPoint.pageNumber}`;
      label.style.cssText = `
        position: absolute;
        top: -12px;
        right: 8px;
        background: #ef4444;
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: 1001;
      `;

      // Add print-specific class for hiding during print
      label.classList.add('page-break-indicator-print-hidden');

      indicator.appendChild(label);
      resumeElement.appendChild(indicator);
    });

    // Update state
    setTotalPages(currentPageNum);
    setPageBreaks(breakPositions.length);
    setCurrentPage(1);

    // Add manual spacing controls
    addManualSpacingControls(sectionsArray);
  }, [resumeElement, addManualSpacingControls, showIndicators]);

  const navigateToPage = (pageNumber: number) => {
    if (!resumeElement) return;

    const indicators = resumeElement.querySelectorAll('.page-break-indicator');
    if (pageNumber === 1) {
      resumeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const targetIndicator = Array.from(indicators).find(indicator => {
        const label = indicator.querySelector('div');
        return label?.textContent?.includes(`Page ${pageNumber}`);
      });

      if (targetIndicator) {
        targetIndicator.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setCurrentPage(pageNumber);
  };

  // Activate page breaks when component mounts or resumeElement changes
  useEffect(() => {
    if (resumeElement) {
      const timeoutId = setTimeout(() => {
        calculatePageBreaks();
      }, 100);

      // Listen for custom events to recalculate page breaks
      const handleRecalculate = () => {
        calculatePageBreaks();
      };

      window.addEventListener('recalculatePageBreaks', handleRecalculate);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('recalculatePageBreaks', handleRecalculate);
      };
    }
    return undefined;
  }, [resumeElement, calculatePageBreaks]);

  return (
    <div className='h-full overflow-y-auto' data-tour='page-breaks-tab'>
      <div className='text-center'>
        <h4 className='text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2'>
          📏 Page Break Controls
        </h4>
        <p className='text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-3'>
          Visualize and adjust page breaks for optimal PDF layout
        </p>

        {/* Toggle Button */}
        <Button
          onClick={toggleIndicators}
          variant={showIndicators ? 'destructive' : 'default'}
          size='sm'
          className='w-full mb-4'
          aria-label={
            showIndicators
              ? 'Hide page break indicators'
              : 'Show page break indicators'
          }
          title={
            showIndicators
              ? 'Click to hide red page break lines and blue page number labels'
              : 'Click to show red page break lines and blue page number labels'
          }
          aria-pressed={showIndicators}
        >
          {showIndicators ? '🙈 Hide Indicators' : '👁️ Show Indicators'}
        </Button>
      </div>

      {/* Page Break Preview */}
      <Card className='p-3 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <h5 className='font-medium text-sm text-blue-900 dark:text-blue-100'>
              📄 Page Break Preview
            </h5>
            <div
              className='text-xs text-blue-700 dark:text-blue-300'
              aria-label={`Resume has ${totalPages} pages with ${pageBreaks} page breaks`}
              title={`Total pages: ${totalPages} | Page breaks: ${pageBreaks}`}
            >
              Pages: {totalPages} | Breaks: {pageBreaks}
            </div>
          </div>

          {/* Page Navigation */}
          {totalPages > 1 && (
            <div className='flex items-center justify-between gap-2'>
              <Button
                onClick={() => navigateToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                variant='outline'
                size='sm'
                className='text-xs'
                aria-label='Go to previous page'
                title='Navigate to the previous page to view page break indicators'
              >
                ← Previous
              </Button>
              <span
                className='text-xs text-blue-700 dark:text-blue-300'
                aria-label={`Currently viewing page ${currentPage} of ${totalPages} total pages`}
                title={`Page ${currentPage} of ${totalPages} - Use Previous/Next buttons to navigate`}
              >
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => navigateToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                variant='outline'
                size='sm'
                className='text-xs'
                aria-label='Go to next page'
                title='Navigate to the next page to view page break indicators'
              >
                Next →
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Manual Spacing Controls */}
      <Card className='p-3 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <h5 className='font-medium text-sm text-green-900 dark:text-green-100'>
              🔧 Manual Spacing Controls
            </h5>
          </div>

          <div className='space-y-2'>
            <h6 className='font-medium text-xs text-gray-700 dark:text-gray-300'>
              Adjust section spacing (10px increments):
            </h6>
            <div
              className='space-y-1 max-h-32 overflow-y-auto page-break-indicator-print-hidden'
              id='manual-spacing-controls'
            >
              {/* Controls will be added here by JavaScript */}
            </div>
          </div>

          <div className='text-xs text-green-700 dark:text-green-300 space-y-1'>
            <div>• Red lines show page breaks</div>
            <div>• Blue labels show page numbers</div>
            <div>• Won&apos;t appear in exported PDF</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PageBreaksTab;
