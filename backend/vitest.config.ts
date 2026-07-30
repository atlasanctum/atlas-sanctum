import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // Ensure relative requires in db.ts resolve correctly under vitest
      './db.mock': path.resolve(__dirname, 'src/db.mock.ts'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    testTimeout: 15000,
    // Run each test file in its own context so env vars set in beforeAll don't leak
    pool: 'forks',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/__tests__/**', 'src/db.mock.ts'],
    },
  },
});
