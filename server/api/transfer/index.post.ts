import { schemaTransfer } from "~~/schemas/transfer.schema"
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
        
    const result = await readValidatedBody(event, body => schemaTransfer.safeParse(body))

    if (!result.success) {
        throw createError({
            status: 422,
            statusMessage: "Unprocessable Entity"
        })
    }

    try {

        return await transferRepository.create(session.session.userId, result.data)

    } catch (error) {

        console.log("Erro ao criar transferência", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})