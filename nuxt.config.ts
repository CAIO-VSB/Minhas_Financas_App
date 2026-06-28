// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css',],
  ssr: false,
  spaLoadingTemplate: true,

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
      title: 'Velto finance',
      meta: [
        {name: "referrer", content: "no-referrer"}
      ],

      link: [
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/genfavicon-32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/genfavicon-16.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon-180x180.png' },
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