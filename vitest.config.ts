import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{js,mjs,ts}'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{js,mjs,ts}'],
      exclude: [
        'src/**/*.astro',
        'src/**/*.d.ts',
        'src/types/**',
        'src/@types/**',
        'src/layouts/**',
        'src/pages/**',
        'src/components/**',
        'scripts/**',
        'tests/**',
      ],
      thresholds: {
        lines: 70,
        functions: 60,
        branches: 50,
        statements: 70,
      },
    },
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});