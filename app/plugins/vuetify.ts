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
            themes: {
                light: {
                    dark: false,
                    colors: {
                        "error-primary": '#C10015',
                        "success-primary": "#21BA45",
                        "alert-primary": "#F2C037"
                    },
                }
            }
        }
    })
    app.vueApp.use(vuetify)
})