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

    const id = Number(getRouterParam(event, "id"))

    const userId = session.session.userId

    if (!id || Number.isNaN(id)) {
        throw createError({
            status: 404,
            statusMessage: "Movimentação não encontrada"
        })
    }

    try {

        console.log("Cgamou na boca do leao agora")

        return await movementsCreditCardRespository.update(id, userId, result.data)

    } catch (error) {
        console.log("Erro ao editar movimentação " + error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})