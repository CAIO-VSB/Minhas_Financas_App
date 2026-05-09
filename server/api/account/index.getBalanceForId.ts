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
        
    try {

        return await accountsRepository.findBalance(session.session.userId)

    } catch (error) {
        console.log("Erro ao buscar movimentações movimentação " + error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})