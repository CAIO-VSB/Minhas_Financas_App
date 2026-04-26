import { schemaAccount } from "~~/schemas/account.schema"
import { auth } from "~~/auth"
import { accountsRepository } from "~~/server/repositories/account.respository"

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
        
    const result = await readValidatedBody(event, body => schemaAccount.safeParse(body))

    if (!result.success) {
        throw createError({
            status: 422,
            statusMessage: "Unprocessable Entity"
        })
    }


    try {

        return await accountsRepository.update(result.data)

    } catch (error) {
        
        console.log("Erro ao modificar conta", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})