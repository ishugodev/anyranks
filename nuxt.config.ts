// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@element-plus/nuxt", "@nuxt/eslint", "@nuxt/test-utils/module"],
  css: ["~/assets/scss/main.scss"],
  eslint: {
    config: {
      autoInit: true,
    },
    checker: true,
  },
});
