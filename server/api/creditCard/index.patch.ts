import { auth } from "~~/auth"
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
        console.log(result)
        throw createError({
            status: 422,
            statusMessage: "Unprocessable Entity"
        })
    }


    try {

       return await creditCardRespository.update(result.data)

    } catch (error) {
        console.log("Erro ao modificar cartão de crédito ", error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})