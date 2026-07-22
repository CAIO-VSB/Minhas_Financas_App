import { auth } from "~~/auth"
import { authRepository } from "~~/server/repositories/auth.respository"

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

    try {

        return await authRepository.findAll(session.session.userId)

    } catch (error) {

        console.log("Erro ao tentar buscar contas", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})