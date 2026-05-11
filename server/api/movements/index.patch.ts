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
        console.log("Erro de validação:", result.error.issues)
        throw createError({
            status: 422,
            statusMessage: "Unprocessable Entity"
        })
    }

    try {

        return await movementsRespository.update(result.data)

    } catch (error) {
        console.log("Erro ao editar movimentação " + error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})