import { auth } from "~~/auth"
import { transferRepository } from "~~/server/repositories/transfer.repository"

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

    const id = Number(getRouterParam(event, "id"))

    if (id === null) {
        throw createError({
            status: 404,
            statusMessage: "Transferência não encontrada"
        })
    }
        
    try {

        return await transferRepository.findById(id)

    } catch (error) {

        console.log("Erro ao buscar transferências", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})