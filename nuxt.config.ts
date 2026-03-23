// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css',],

  build: {
    transpile: ['vuetify', '@vuepic/vue-datepicker']
  },

  toast: {composableName: 'useNotification'},
  
  modules: [ 
    '@peterbud/nuxt-query',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-toast',

    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins?.push(vuetify({ autoImport: true}))
      })
    },
  ],

  nuxtQuery: {
    autoImports: ["useQuery", "useMutation", "useQueryClient"],
    devtools: true,

    queryClientOptions: {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        }
      }
    }
  },
  
  vite: {
    vue: {
      template: {
        transformAssetUrls
      }
    },

    css: {
      preprocessorOptions: {
        scss: {
        additionalData: '@use "~/assets/sass/_variables.sass" as *;'
        },
      },
    },

    plugins: [
      tailwindcss(),  
    ],


  }
})