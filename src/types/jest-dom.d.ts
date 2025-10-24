import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveAttribute(attribute: string, value?: string): R;
      toHaveFocus(): R;
      toBeDisabled(): R;
      toContainHTML(html: string): R;
    }
  }
}
