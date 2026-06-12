import { auth } from "~~/auth"
import { transferRepository } from "~~/server/repositories/transfer.repository"
import * as z from "zod";

export default defineEventHandler( async (event) => {

    const schemaTransferSoftDelete = z.object({
        is_deleted: z.boolean()
    })

    const session = await auth.api.getSession({
        headers: event.headers
    })

    if (!session?.session.token) {
        throw createError({
            status: 401,
            statusMessage: "Unauthorized"
        })
    }

    const result = await readValidatedBody(event, body => schemaTransferSoftDelete.safeParse(body))

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

        return await transferRepository.updateSoftDelete(id, result.data.is_deleted)

    } catch (error) {

        console.log("Erro ao editar transferências", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})