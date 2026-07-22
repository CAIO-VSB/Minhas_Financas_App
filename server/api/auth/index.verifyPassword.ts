import { APIError } from "better-auth"
import { auth } from "~~/auth"

export default defineEventHandler( async (event) => {

    const session = await auth.api.getSession({
        headers: event.headers
    })

    if (!session?.session.token) {
        throw createError({
            status: 401,
            statusMessage: "Unauthorized"
        })
    }

    const { password } = await readBody(event)

    try {

        await auth.api.verifyPassword({
            body: {
                password: password
            },
            headers: event.headers
        })

        return { valid: true }

    } catch (error) {

        if (error instanceof APIError) {
            return { valid: false}
        }
        console.log("Erro ao verificar senha:", error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})