import '@testing-library/jest-dom'

// ResizeObserver is not available in jsdom — provide a no-op stub
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
