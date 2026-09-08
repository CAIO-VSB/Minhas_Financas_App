import { schemaGoalsMovements } from "~~/schemas/goalsMovements.schema"
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
        
    const result = await readValidatedBody(event, body => schemaGoalsMovements.safeParse(body))

    if (!result.success) {
        throw createError({
            status: 422,
            statusMessage: "Unprocessable Entity"
        })
    }

    try {

        return await goalsRepository.createMovementsGoals(result.data)

    } catch (error) {

        console.log("Erro ao criar movimentação da economia", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})