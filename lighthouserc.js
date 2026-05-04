module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4321/',
        'http://localhost:4321/vermietung',
        'http://localhost:4321/dj/mixes',
        'http://localhost:4321/dj/mixes-all'
      ],
      startServerCommand: 'pnpm run preview',
      startServerReadyPattern: 'Server listening',
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['error', {minScore: 0.9}],
        'categories:seo': ['error', {minScore: 0.9}],
        'audit:largest-contentfulpaint': ['error', {maxNumericValue: 2500}],
        'audit:first-input-delay': ['error', {maxNumericValue: 100}],
        'audit:cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
        'audit:interactive': ['warn', {maxNumericValue: 3800}]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
