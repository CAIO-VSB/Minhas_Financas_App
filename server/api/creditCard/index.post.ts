import { auth } from "~~/auth"
import client from "~/utils/db"
import { schemaCreditCard } from "~~/schemas/creditCard.schema"
import { creditCardRespository } from "~~/server/repositories/creditCard.respository"

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
        
    const result = await readValidatedBody(event, body => schemaCreditCard.safeParse(body))

    if (!result.success) {
        throw createError({
            status: 422,
            statusMessage: "Unprocessable Entity"
        })
    }


    try {

        return await creditCardRespository.create(session.session.userId, result.data)

    } catch (error) {
        console.log("Erro ao criar cartao de credito" + error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})