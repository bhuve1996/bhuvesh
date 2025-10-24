import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import React from 'react';

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
    // Filter out Next.js specific props to prevent DOM warnings
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      priority: _priority,
      placeholder: _placeholder,
      blurDataURL: _blurDataURL,
      loader: _loader,
      quality: _quality,
      sizes: _sizes,
      unoptimized: _unoptimized,
      onLoad: _onLoad,
      onError: _onError,
      onLoadingComplete: _onLoadingComplete,
      fill: _fill,
      ...domProps
    } = props;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    // eslint-disable-next-line @next/next/no-img-element
    return <img {...domProps} alt={props.alt || ''} />;
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
jest.mock('framer-motion', () => {
  const createMotionComponent = tag => {
    const Component = ({ children, ...props }) => {
      // Filter out framer-motion specific props to prevent DOM warnings
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const {
        whileHover: _whileHover,
        whileTap: _whileTap,
        whileFocus: _whileFocus,
        whileInView: _whileInView,
        whileDrag: _whileDrag,
        drag: _drag,
        dragConstraints: _dragConstraints,
        dragElastic: _dragElastic,
        dragMomentum: _dragMomentum,
        dragPropagation: _dragPropagation,
        dragSnapToOrigin: _dragSnapToOrigin,
        dragTransition: _dragTransition,
        dragControls: _dragControls,
        dragListener: _dragListener,
        onDrag: _onDrag,
        onDragStart: _onDragStart,
        onDragEnd: _onDragEnd,
        onDirectionLock: _onDirectionLock,
        onDragTransitionEnd: _onDragTransitionEnd,
        animate: _animate,
        transition: _transition,
        variants: _variants,
        initial: _initial,
        exit: _exit,
        layout: _layout,
        layoutId: _layoutId,
        layoutDependency: _layoutDependency,
        layoutScroll: _layoutScroll,
        layoutRoot: _layoutRoot,
        ...domProps
      } = props;
      /* eslint-enable @typescript-eslint/no-unused-vars */

      return React.createElement(tag, domProps, children);
    };
    Component.displayName = `motion.${tag}`;
    return Component;
  };

  return {
    motion: {
      div: createMotionComponent('div'),
      button: createMotionComponent('button'),
      nav: createMotionComponent('nav'),
      span: createMotionComponent('span'),
      section: createMotionComponent('section'),
      article: createMotionComponent('article'),
      header: createMotionComponent('header'),
      footer: createMotionComponent('footer'),
      main: createMotionComponent('main'),
      aside: createMotionComponent('aside'),
      h1: createMotionComponent('h1'),
      h2: createMotionComponent('h2'),
      h3: createMotionComponent('h3'),
      h4: createMotionComponent('h4'),
      h5: createMotionComponent('h5'),
      h6: createMotionComponent('h6'),
      p: createMotionComponent('p'),
      a: createMotionComponent('a'),
      img: createMotionComponent('img'),
      svg: createMotionComponent('svg'),
      path: createMotionComponent('path'),
      circle: createMotionComponent('circle'),
      rect: createMotionComponent('rect'),
      line: createMotionComponent('line'),
      polygon: createMotionComponent('polygon'),
      polyline: createMotionComponent('polyline'),
      ellipse: createMotionComponent('ellipse'),
      g: createMotionComponent('g'),
      defs: createMotionComponent('defs'),
      clipPath: createMotionComponent('clipPath'),
      mask: createMotionComponent('mask'),
      pattern: createMotionComponent('pattern'),
      linearGradient: createMotionComponent('linearGradient'),
      radialGradient: createMotionComponent('radialGradient'),
      stop: createMotionComponent('stop'),
      text: createMotionComponent('text'),
      tspan: createMotionComponent('tspan'),
      textPath: createMotionComponent('textPath'),
      foreignObject: createMotionComponent('foreignObject'),
      switch: createMotionComponent('switch'),
      use: createMotionComponent('use'),
      image: createMotionComponent('image'),
      marker: createMotionComponent('marker'),
      symbol: createMotionComponent('symbol'),
      view: createMotionComponent('view'),
      animate: createMotionComponent('animate'),
      set: createMotionComponent('set'),
      filter: createMotionComponent('filter'),
      feGaussianBlur: createMotionComponent('feGaussianBlur'),
      feColorMatrix: createMotionComponent('feColorMatrix'),
      feComponentTransfer: createMotionComponent('feComponentTransfer'),
      feComposite: createMotionComponent('feComposite'),
      feConvolveMatrix: createMotionComponent('feConvolveMatrix'),
      feDiffuseLighting: createMotionComponent('feDiffuseLighting'),
      feDisplacementMap: createMotionComponent('feDisplacementMap'),
      feFlood: createMotionComponent('feFlood'),
      feFuncA: createMotionComponent('feFuncA'),
      feFuncB: createMotionComponent('feFuncB'),
      feFuncG: createMotionComponent('feFuncG'),
      feFuncR: createMotionComponent('feFuncR'),
      feImage: createMotionComponent('feImage'),
      feMerge: createMotionComponent('feMerge'),
      feMergeNode: createMotionComponent('feMergeNode'),
      feMorphology: createMotionComponent('feMorphology'),
      feOffset: createMotionComponent('feOffset'),
      feSpecularLighting: createMotionComponent('feSpecularLighting'),
      feTile: createMotionComponent('feTile'),
      feTurbulence: createMotionComponent('feTurbulence'),
      feDistantLight: createMotionComponent('feDistantLight'),
      fePointLight: createMotionComponent('fePointLight'),
      feSpotLight: createMotionComponent('feSpotLight'),
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
    useTransition: (items, _config) => items,
    useInView: () => false,
    useReducedMotion: () => false,
  };
});

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
// eslint-disable-next-line no-console
const originalWarn = console.warn;
beforeAll(() => {
  // eslint-disable-next-line no-console
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
  // eslint-disable-next-line no-console
  console.warn = originalWarn;
});
