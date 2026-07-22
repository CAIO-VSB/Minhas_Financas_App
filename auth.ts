import { betterAuth } from "better-auth"
import { sendUserEmail } from "~~/server/api/auth/send-verification-email"
import { sendForgotPassword } from "~~/server/api/auth/send-reset-password"
import { Pool } from "pg"
import { sendChangeEmail } from "~~/server/api/auth/send-change-email-confirmation"


export const auth = betterAuth({

    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24
    },

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

    user: {
        changeEmail: {
            enabled: true,
            sendChangeEmailConfirmation: async ({user, newEmail, url}) => {
                await sendChangeEmail({email: user.email, newEmail}, url)
            },
        },
    },
    
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            prompt: "select_account"
        },

        discord: { 
            clientId: process.env.DISCORD_CLIENT_ID as string, 
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
        }, 

    },

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["discord", "google"]
        }
    },

    onAPIError: {
        
        onError(e) {
            console.log(e)
        },
        errorURL: "/error.vue"
    },

    trustedOrigins: ["http://localhost:3000", "http://10.20.20.7:3000"]

    
})