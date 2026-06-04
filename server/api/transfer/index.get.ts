import { auth } from "~~/auth"
import { transferRepository } from "~~/server/repositories/transfer.repository"

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

        return await transferRepository.findAll(session.session.userId, monthNumber, yearNumber)

    } catch (error) {

        console.log("Erro ao buscar transferências", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})