import { betterAuth } from "better-auth"
import { sendUserEmail } from "../server/api/auth/send-verification-email"
import { sendForgotPassword } from "../server/api/auth/send-reset-password"
import { Pool } from "pg"


export const auth = betterAuth({

    database: new Pool({
        connectionString: process.env.DATABASE_URL
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        autoSignIn: false,
        
        sendResetPassword: async ({user, url}) => {
            await sendForgotPassword(user, url)
        }
    },

    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
           await sendUserEmail(user, url)
        },
        sendOnSignIn: true,
        sendOnSignUp: true
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            prompt: "select_account"
        }
    },

    
})