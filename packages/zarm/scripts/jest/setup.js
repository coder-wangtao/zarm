// 这段代码主要用于 在 Jest 测试环境中模拟浏览器原生 API，保证测试不会报错，同时可以 spy 或 mock 某些方法行为。

import '@testing-library/jest-dom';

Object.defineProperty(window, 'SVGRect', { value: 'SVGRect', writable: true });

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

window.scrollTo = window.scrollTo || jest.fn();
window.HTMLElement.prototype.scrollTo = jest.fn();
