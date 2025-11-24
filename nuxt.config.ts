// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/test-utils/module"],
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "AnyRanks",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          name: "description",
          content: "Rank list for anything",
        },
      ],
    },
  },
  css: ["~/assets/scss/main.scss"],
  eslint: {
    config: {
      autoInit: true,
    },
    checker: true,
  },
});
