import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically reset the DOM after each test run.
afterEach(() => {
  cleanup();
});
