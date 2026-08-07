import { auth } from "~~/auth"
import { schemaMovementCreditCard } from "~~/schemas/movementCreditCard.schema"
import { movementsCreditCardRespository } from "~~/server/repositories/movimentCreditCard.repository"

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
        
    const result = await readValidatedBody(event, body => schemaMovementCreditCard.safeParse(body))

    if (!result.success) {
        throw createError({
            status: 422,
            statusMessage: "Unprocessable Entity",
            data: result.error.flatten()
        })
    }

    try {
        return await movementsCreditCardRespository.create(session.session.userId, result.data)
    } catch (error) {
        console.log("Erro ao criar movimentacao cartao de credito " + error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error",
            message: "Erro ao criar"
        })
    }

})