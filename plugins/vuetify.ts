// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'


import 'vuetify/styles'
import  { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        ssr: true,
        theme: {
            themes: {
                light: {
                    dark: false,
                    colors: {
                        "error-primary": '#C10015',
                        "success-primary": "#21BA45",
                        "alert-primary": "#F2C037"
                    }
                }
            }
        }
    })
    app.vueApp.use(vuetify)
})