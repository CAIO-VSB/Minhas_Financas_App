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
    
    const { month, year } = getQuery(event)

    const monthNumber = Number(month) + 1
    const yearNumber = Number(year)
        

    if (!id || Number.isNaN(id)) {
        throw createError({
            status: 404,
            statusMessage: "Economia não encontrada"
        })
    }
    
    try {

       return await goalsRepository.getAllMovementsGoals(session.session.userId, id, monthNumber, yearNumber)

    } catch (error) {
        console.log("Erro ao buscar movimentações da economia", error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})