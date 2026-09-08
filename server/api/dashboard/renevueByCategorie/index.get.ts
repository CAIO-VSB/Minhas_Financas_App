import { auth } from "~~/auth"
import { dashboardRepository } from "~~/server/repositories/dashboard.repository"

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

        return await dashboardRepository.findAllRenevueByCategorie(session.session.userId, monthNumber, yearNumber)

    } catch (error) {

        console.log("Erro ao dados para o dashboard", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})