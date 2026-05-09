import { auth } from "~~/auth"
import { movementsRespository } from "~~/server/repositories/moviments.repository"

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

    const { month, year } = getQuery(event)

    const monthNumber = Number(month) + 1
    const yearNumber = Number(year)
        
    try {

        return await movementsRespository.findAll(session.session.userId, monthNumber, yearNumber)

    } catch (error) {
        console.log("Erro ao buscar movimentações movimentação " + error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})