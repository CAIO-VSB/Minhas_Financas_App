// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css',],

  build: {
    transpile: ['vuetify']
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

  app: {
    head: {
      title: 'Minhas finanças',
      meta: [
        {name: "referrer", content: "no-referrer"}
      ],

      link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.png'}
    ]
    },
  },
  
  vite: {
    vue: {
      template: {
        transformAssetUrls
      }
    },

  }
})