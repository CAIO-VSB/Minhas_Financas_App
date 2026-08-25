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
    
    try {
        return await movementsCreditCardRespository.findAllMovementsCreditCard(session.session.userId)
    } catch (error) {
        console.log("Erro ao buscar movimentacao cartao de credito " + error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error",
            message: "Erro ao buscar"
        })
    }

})