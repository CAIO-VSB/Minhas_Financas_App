import { auth } from "~~/auth"
import { goalsRepository } from "~~/server/repositories/goals.repository"

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

        return await goalsRepository.findAll(session.session.userId)

    } catch (error) {

        console.log("Erro ao buscar as economias", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})