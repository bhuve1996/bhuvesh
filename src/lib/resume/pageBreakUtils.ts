/**
 * Utility functions for smart page break handling in PDF generation
 */

export interface PageBreakConfig {
  enableSmartBreaks: boolean;
  minContentPerPage: number;
  maxContentPerPage: number;
  avoidBreakingSections: string[];
  forceBreakAfter: string[];
}

export const DEFAULT_PAGE_BREAK_CONFIG: PageBreakConfig = {
  enableSmartBreaks: true,
  minContentPerPage: 2,
  maxContentPerPage: 8,
  avoidBreakingSections: [
    'experience-entry',
    'education-entry',
    'project-entry',
    'skills-list',
    'achievements-list',
    'contact-info',
    'summary-section',
    'objective-section',
  ],
  forceBreakAfter: ['experience-section', 'education-section'],
};

/**
 * Apply smart page break classes to resume elements
 */
export const applySmartPageBreaks = (
  element: HTMLElement,
  config: PageBreakConfig = DEFAULT_PAGE_BREAK_CONFIG
): void => {
  if (!config.enableSmartBreaks) return;

  // Apply section-level classes based on headings and their containers
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading, index) => {
    const headingElement = heading as HTMLElement;

    // Find the parent container that represents a section
    let sectionElement = headingElement.parentElement;

    // Look for a parent with spacing classes (likely a section container)
    while (sectionElement && sectionElement !== element) {
      const className = sectionElement.className;
      if (
        className.includes('space-y') ||
        className.includes('mb-') ||
        className.includes('mt-')
      ) {
        break;
      }
      sectionElement = sectionElement.parentElement;
    }

    if (sectionElement) {
      // Add resume-section class for general page break handling
      sectionElement.classList.add('resume-section');

      // Add avoid-break class to prevent breaking inside sections
      sectionElement.classList.add('avoid-break');

      // Force page break after certain sections if configured
      const headingText = headingElement.textContent?.toLowerCase() || '';
      if (
        config.forceBreakAfter.some(
          breakAfter =>
            headingText.includes(breakAfter.replace('-section', '')) &&
            index < headings.length - 1
        )
      ) {
        sectionElement.classList.add('break-after');
      }
    }
  });

  // Apply entry-level classes
  const entries = element.querySelectorAll('[class*="entry"], [class*="item"]');
  entries.forEach(entry => {
    const entryElement = entry as HTMLElement;
    const className = entryElement.className.toLowerCase();

    // Check if this entry type should avoid breaking
    if (
      config.avoidBreakingSections.some(avoidClass =>
        className.includes(avoidClass)
      )
    ) {
      entryElement.classList.add('avoid-break');
    }

    // Add specific entry classes
    if (className.includes('experience')) {
      entryElement.classList.add('experience-entry');
    } else if (className.includes('education')) {
      entryElement.classList.add('education-entry');
    } else if (className.includes('project')) {
      entryElement.classList.add('project-entry');
    } else if (className.includes('skill')) {
      entryElement.classList.add('skill-item');
    } else if (className.includes('achievement')) {
      entryElement.classList.add('achievement-item');
    }
  });

  // Apply title classes
  const titles = element.querySelectorAll(
    'h1, h2, h3, h4, h5, h6, [class*="title"], [class*="header"]'
  );
  titles.forEach(title => {
    const titleElement = title as HTMLElement;
    titleElement.classList.add('section-title');
  });

  // Apply list classes
  const lists = element.querySelectorAll('ul, ol, [class*="list"]');
  lists.forEach(list => {
    const listElement = list as HTMLElement;
    const className = listElement.className.toLowerCase();

    if (className.includes('skill')) {
      listElement.classList.add('skills-list');
    } else if (className.includes('achievement')) {
      listElement.classList.add('achievements-list');
    }

    listElement.classList.add('avoid-break');
  });

  // Apply contact info classes
  const contactElements = element.querySelectorAll(
    '[class*="contact"], [class*="info"]'
  );
  contactElements.forEach(contact => {
    const contactElement = contact as HTMLElement;
    contactElement.classList.add('contact-info');
  });

  // Apply summary/objective classes
  const summaryElements = element.querySelectorAll(
    '[class*="summary"], [class*="objective"], [class*="about"]'
  );
  summaryElements.forEach(summary => {
    const summaryElement = summary as HTMLElement;
    summaryElement.classList.add('summary-section');
  });

  // Apply table classes
  const tables = element.querySelectorAll('table');
  tables.forEach(table => {
    table.classList.add('avoid-break');
  });

  // Apply image classes
  const images = element.querySelectorAll('img, svg');
  images.forEach(img => {
    img.classList.add('avoid-break');
  });
};

/**
 * Calculate optimal page breaks based on content height
 * Uses actual PDF dimensions (A4: 8.27" x 11.69" = 595 x 842 points)
 */
export const calculateOptimalPageBreaks = (
  element: HTMLElement,
  pageHeight: number = 842, // A4 height in points (11.69 inches)
  margin: number = 72 // 1 inch margin (72 points)
): HTMLElement[] => {
  const sections = Array.from(
    element.querySelectorAll('.resume-section')
  ) as HTMLElement[];
  const pages: HTMLElement[] = [];
  let currentPageHeight = margin;
  let currentPageSections: HTMLElement[] = [];

  // Convert pixels to points (assuming 96 DPI: 1 point = 1.33 pixels)
  const pixelsToPoints = (pixels: number): number => pixels * 0.75;

  sections.forEach((section, index) => {
    const sectionHeightPoints = pixelsToPoints(section.offsetHeight);
    const availableHeight = pageHeight - currentPageHeight - margin;

    // If section fits on current page
    if (sectionHeightPoints <= availableHeight) {
      currentPageSections.push(section);
      currentPageHeight += sectionHeightPoints;
    } else {
      // If we have content on current page, create a page
      if (currentPageSections.length > 0) {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'resume-page';
        currentPageSections.forEach(section => {
          pageDiv.appendChild(section.cloneNode(true));
        });
        pages.push(pageDiv);

        // Start new page
        currentPageSections = [section];
        currentPageHeight = margin + sectionHeightPoints;
      } else {
        // Section is too large for a single page, force it anyway
        currentPageSections.push(section);
        currentPageHeight += sectionHeightPoints;
      }
    }

    // If this is the last section, add remaining content to a page
    if (index === sections.length - 1 && currentPageSections.length > 0) {
      const pageDiv = document.createElement('div');
      pageDiv.className = 'resume-page';
      currentPageSections.forEach(section => {
        pageDiv.appendChild(section.cloneNode(true));
      });
      pages.push(pageDiv);
    }
  });

  return pages;
};

/**
 * Add page break indicators to HTML for better PDF generation
 */
export const addPageBreakIndicators = (element: HTMLElement): void => {
  const sections = element.querySelectorAll('.resume-section');

  sections.forEach((section, index) => {
    const sectionElement = section as HTMLElement;

    // Add page break before certain sections
    if (
      index > 0 &&
      (sectionElement.className.includes('experience-section') ||
        sectionElement.className.includes('education-section') ||
        sectionElement.className.includes('projects-section'))
    ) {
      sectionElement.classList.add('break-before');
    }
  });
};

/**
 * Optimize content for PDF by adjusting spacing and layout
 */
export const optimizeForPDF = (element: HTMLElement): void => {
  // Reduce excessive margins and padding
  const elementsWithSpacing = element.querySelectorAll(
    '[class*="mb-"], [class*="mt-"], [class*="py-"], [class*="my-"]'
  );
  elementsWithSpacing.forEach(el => {
    const element = el as HTMLElement;
    const computedStyle = window.getComputedStyle(element);

    // Reduce large margins/padding for PDF
    if (parseFloat(computedStyle.marginBottom) > 24) {
      element.style.marginBottom = '12px';
    }
    if (parseFloat(computedStyle.marginTop) > 24) {
      element.style.marginTop = '12px';
    }
    if (parseFloat(computedStyle.paddingTop) > 16) {
      element.style.paddingTop = '8px';
    }
    if (parseFloat(computedStyle.paddingBottom) > 16) {
      element.style.paddingBottom = '8px';
    }
  });

  // Ensure text doesn't overflow
  const textElements = element.querySelectorAll('p, span, div');
  textElements.forEach(el => {
    const element = el as HTMLElement;
    element.style.wordWrap = 'break-word';
    element.style.overflowWrap = 'break-word';
  });
};

/**
 * Main function to prepare resume for PDF export
 */
export const prepareResumeForPDF = (
  element: HTMLElement,
  config: PageBreakConfig = DEFAULT_PAGE_BREAK_CONFIG
): HTMLElement => {
  // Clone the element to avoid modifying the original
  const clonedElement = element.cloneNode(true) as HTMLElement;

  // Apply smart page breaks
  applySmartPageBreaks(clonedElement, config);

  // Add page break indicators
  addPageBreakIndicators(clonedElement);

  // Optimize for PDF
  optimizeForPDF(clonedElement);

  return clonedElement;
};
