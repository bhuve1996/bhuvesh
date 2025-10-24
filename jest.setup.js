import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: props => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  SessionProvider: ({ children }) => children,
}));

// Mock next-auth
jest.mock('@auth/core', () => ({
  Auth: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    nav: 'nav',
    span: 'span',
    section: 'section',
    article: 'article',
    header: 'header',
    footer: 'footer',
    main: 'main',
    aside: 'aside',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    p: 'p',
    a: 'a',
    img: 'img',
    svg: 'svg',
    path: 'path',
    circle: 'circle',
    rect: 'rect',
    line: 'line',
    polygon: 'polygon',
    polyline: 'polyline',
    ellipse: 'ellipse',
    g: 'g',
    defs: 'defs',
    clipPath: 'clipPath',
    mask: 'mask',
    pattern: 'pattern',
    linearGradient: 'linearGradient',
    radialGradient: 'radialGradient',
    stop: 'stop',
    text: 'text',
    tspan: 'tspan',
    textPath: 'textPath',
    foreignObject: 'foreignObject',
    switch: 'switch',
    use: 'use',
    image: 'image',
    marker: 'marker',
    symbol: 'symbol',
    view: 'view',
    animate: 'animate',
    set: 'set',
    filter: 'filter',
    feGaussianBlur: 'feGaussianBlur',
    feColorMatrix: 'feColorMatrix',
    feComponentTransfer: 'feComponentTransfer',
    feComposite: 'feComposite',
    feConvolveMatrix: 'feConvolveMatrix',
    feDiffuseLighting: 'feDiffuseLighting',
    feDisplacementMap: 'feDisplacementMap',
    feFlood: 'feFlood',
    feFuncA: 'feFuncA',
    feFuncB: 'feFuncB',
    feFuncG: 'feFuncG',
    feFuncR: 'feFuncR',
    feGaussianBlur: 'feGaussianBlur',
    feImage: 'feImage',
    feMerge: 'feMerge',
    feMergeNode: 'feMergeNode',
    feMorphology: 'feMorphology',
    feOffset: 'feOffset',
    feSpecularLighting: 'feSpecularLighting',
    feTile: 'feTile',
    feTurbulence: 'feTurbulence',
    feDistantLight: 'feDistantLight',
    fePointLight: 'fePointLight',
    feSpotLight: 'feSpotLight',
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  useMotionValue: value => ({ get: () => value, set: jest.fn() }),
  useTransform: (value, transform) => ({ get: () => transform(value.get()) }),
  useSpring: value => value,
  useTransition: (items, config) => items,
  useInView: () => false,
  useReducedMotion: () => false,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock scrollTo
global.scrollTo = jest.fn();

// Suppress console warnings in tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});
