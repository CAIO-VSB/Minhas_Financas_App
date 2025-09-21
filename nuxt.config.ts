// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import tailwindcss from "@tailwindcss/vite";


export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css', ],

  build: {
    transpile: ['vuetify']
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    'pinia-plugin-persistedstate/nuxt',

    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins?.push(vuetify({ autoImport: true}))
      })
    },
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls
      }
    },

    css: {
      preprocessorOptions: {
        scss: {
        additionalData: '@use "~/assets/scss/_variables.scss" as *;'
        },
      },
    },

    plugins: [
      tailwindcss()
    ]
  }
})