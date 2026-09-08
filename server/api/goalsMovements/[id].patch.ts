import { auth } from "~~/auth"
import { schemaGoalsMovements } from "~~/schemas/goalsMovements.schema"
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
        
    const id = Number(getRouterParam(event, "id"))

    const result = await readValidatedBody(event, body => schemaGoalsMovements.safeParse(body))

    if (!result.success) {
        throw createError({
            status: 422,
            statusMessage: "Unprocessable Entity"
        })
    }

    if (!id || Number.isNaN(id)) {
        throw createError({
            status: 404,
            statusMessage: "Movimentaçõ não encontrada"
        })
    }
    
    try {

       return await goalsRepository.updateMovementsGoals(id, result.data)

    } catch (error) {
        console.log("Erro ao editar movimentações da economia", error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})