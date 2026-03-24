import '@testing-library/jest-dom';

// Mock ResizeObserver for recharts
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Mock scrollTo
window.scrollTo = vi.fn();

// Mock confirm
window.confirm = vi.fn(() => true);
