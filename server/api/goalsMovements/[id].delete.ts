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
        
    const id = Number(getRouterParam(event, "id"))

    if (!id || Number.isNaN(id)) {
        throw createError({
            status: 404,
            statusMessage: "Movimentação não encontrada"
        })
    }
    
    try {

       return await goalsRepository.deleteGoalsMovement(id)

    } catch (error) {
        console.log("Erro ao deletar movimentações da economia", error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})