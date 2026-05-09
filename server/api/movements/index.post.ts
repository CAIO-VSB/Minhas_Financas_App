import { auth } from "~~/auth"
import { schemaMovements } from "~~/schemas/movements.schema"
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
        
    const result = await readValidatedBody(event, body => schemaMovements.safeParse(body))

    if (!result.success) {
        throw createError({
            status: 422,
            statusMessage: "Unprocessable Entity"
        })
    }

    try {

        return await movementsRespository.create(session.session.userId, result.data)

    } catch (error) {
        console.log("Erro ao criar movimentação " + error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})