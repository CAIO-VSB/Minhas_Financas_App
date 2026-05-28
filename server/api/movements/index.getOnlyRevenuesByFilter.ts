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

    const { start_day, end_day, categorie_id, accounts_id, situation, for_type} = await readBody(event)
        
    try {

        return await movementsRespository.findOnlyRevenuesByFilter(session.session.userId, start_day, end_day, categorie_id, accounts_id, situation, for_type)

    } catch (error) {
        console.log("Erro ao buscar movimentações movimentação " + error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})