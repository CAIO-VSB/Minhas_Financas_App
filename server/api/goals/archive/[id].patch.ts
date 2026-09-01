import { auth } from "~~/auth"
import { schemaGoals, schemaGoalsArchive } from "~~/schemas/goals.schema"
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
        
    const result = await readValidatedBody(event, body => schemaGoalsArchive.safeParse(body))

    if (!result.success) {
        throw createError({
            status: 422,
            statusMessage: "Unprocessable Entity"
        })
    }

    const id = Number(getRouterParam(event, "id"))

    if (!id || Number.isNaN(id)) {
        throw createError({
            status: 404,
            statusMessage: "Economia não encontrada"
        })
    }
    
    try {

       return await goalsRepository.archive(session.session.userId, id, result.data.active)

    } catch (error) {
        console.log("Erro ao modificar economia crédito ", error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})