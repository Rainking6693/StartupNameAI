import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock console.error to avoid noise from React Router warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Mock intersection observer for tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

test('renders without crashing', () => {
  render(<App />);
});

test('renders key landing content', () => {
  render(<App />);
  expect(screen.getByText(/AI Startup Name Generator/i)).toBeInTheDocument();
});

test('application initializes without critical JavaScript errors', () => {
  const spy = jest.spyOn(console, 'error');
  render(<App />);

  // Filter out known React warnings that are not actual errors
  const actualErrors = spy.mock.calls.filter(call => {
    const message = call[0] || '';
    return (
      !message.includes('Warning:') &&
      !message.includes('validateDOMNesting') &&
      !message.includes('React does not recognize') &&
      message.includes('Error')
    );
  });

  expect(actualErrors.length).toBe(0);
  spy.mockRestore();
});
