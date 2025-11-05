import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"
import { sendUserEmail } from "../server/api/auth/send-verification-email"
import { sendForgotPassword } from "../server/api/auth/send-reset-password"


export const auth = betterAuth({

    database: prismaAdapter(prisma, {
        provider: "mysql"
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