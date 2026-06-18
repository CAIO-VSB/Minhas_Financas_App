import { schemaAccount } from "~~/schemas/account.schema"
import { auth } from "~~/auth"
import { accountsRepository } from "~~/server/repositories/account.repository"

export default defineEventHandler( async (event) => {

    const body = await readBody(event)
    console.log("Body recebido:", body)

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

    const id = Number(getRouterParam(event, "id"))

    if (id === null) {
        throw createError({
            status: 404,
            statusMessage: "Conta não encontrada"
        })
    }
       

    try {

        return await accountsRepository.update(session.session.userId, result.data, id)

    } catch (error) {
        
        console.log("Erro ao modificar conta", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})