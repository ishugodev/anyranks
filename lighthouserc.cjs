module.exports = {
  ci: {
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
      },
    },
    collect: {
      staticDistDir: "./.output/public",
      url: ["http://localhost/"],
      chromePath: "/usr/bin/google-chrome",
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
