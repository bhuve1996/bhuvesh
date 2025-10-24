// Type declarations for external libraries without @types packages

declare module 'color-contrast-checker' {
  export class ContrastChecker {
    constructor();
    getRatio(color1: string, color2: string): number;
    isLevelAA(
      foreground: string,
      background: string,
      fontSize: number
    ): boolean;
    isLevelAAA(
      foreground: string,
      background: string,
      fontSize: number
    ): boolean;
  }
}

declare module 'html-docx-js/dist/html-docx' {
  const htmlDocx: {
    (html: string, options?: any): Blob;
  };
  export default htmlDocx;
}
