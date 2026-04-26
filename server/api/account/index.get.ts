import { auth } from "~~/auth"
import client from "~/utils/db"
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

    const { active } = getQuery(event)

    try {

        return await accountsRepository.findAll(
            session.session.userId,
            active !== undefined ? active === "true" : undefined 
        )

    } catch (error) {

        console.log("Erro ao tentar buscar contas", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})