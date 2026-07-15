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
    "nuxt-api-shield",

    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins?.push(vuetify({ autoImport: true}))
      })
    },
  ],

  nuxtApiShield: {

    limit: {
      max: 12,
      duration: 5,
      ban: 5,
    },

    delayOnBan: true,
    errorMessage: "Too many Requests",
    retryAfterHeader: true,
    
    log: {
      path: "./logs/nuxt-api-shield",
      attempts: 1,
      fail2ban: true,
    },

    routes: ["/api/auth/sign-in/email"],
    skipRoutes: [],
    ipTTL: 7 * 24 * 60 * 60,

    security: {
      trustXForwardedFor: false,
    }
  },

  
  nitro: {
    "storage": {
      "shield": {
        "driver": "memory"
      }
    },
  },

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