import { createAuthClient } from "better-auth/vue" 

export default defineNuxtPlugin((nuxtApp) => {
    const authClient = createAuthClient({})
    
    return {
        provide: {
            authClient
        }
    }
})

