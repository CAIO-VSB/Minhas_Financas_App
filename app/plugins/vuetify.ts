// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import  { createVuetify } from 'vuetify'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { pt } from "vuetify/locale"
// import { pt } from "vuetify/locale"

export default defineNuxtPlugin((app) => {
   const vuetify = createVuetify({
        components: {
            VDateInput
        },
        locale: {
            locale: "pt",
            fallback: "en",
            messages: { pt }
        },
        date: {
            pt: 'pt',
        },
        ssr: true,
        theme: {
            defaultTheme: 'finance',
            themes: {
                finance: {
                    dark: false,
                    colors: {
                        backgroundPrimary: '#f6f7fb',
                        surface: '#ffffff',
                        secondary: '#f2f2f2',
                        textPrimary: '#2563EB',
                        textSecundary: '#757575',
                        textAlternative: '#454843',
                    }
                }
            }
        }
    })
    app.vueApp.use(vuetify)
})