import { createAuthClient } from "better-auth/vue" 

export const authClient = createAuthClient({})

export const { signIn, signUp, useSession } = createAuthClient()