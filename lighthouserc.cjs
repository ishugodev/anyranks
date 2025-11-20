module.exports = {
  ci: {
    assert: {
      preset: "lighthouse:recommended",
    },
    collect: {
      staticDistDir: "./.output/public",
      url: ["http://localhost/"],
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
