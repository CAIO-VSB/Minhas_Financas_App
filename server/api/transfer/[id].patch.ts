import { auth } from "~~/auth"
import { transferRepository } from "~~/server/repositories/transfer.repository"
import { schemaTransfer } from "~~/schemas/transfer.schema"

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

    const result = await readValidatedBody(event, body => schemaTransfer.safeParse(body))

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
            statusMessage: "Transferência não encontrada"
        })
    }
        
    try {

        return await transferRepository.update(id, result.data)

    } catch (error) {

        console.log("Erro ao editar transferências", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})