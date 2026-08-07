import { auth } from "~~/auth"
import { z } from "zod"
import { schemaMovements } from "~~/schemas/movements.schema"
import { schemaRecurrence } from "~~/schemas/recurrence.schema"
import { recurrenceRepository } from "~~/server/repositories/recurrence.repository"

const schemaUnified = z.object({
    recurrence: schemaRecurrence,
    movements: z.array(schemaMovements)
})

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
        
    const result = await readValidatedBody(event, body => schemaUnified.safeParse(body))

    if (!result.success) {
        throw createError({
            status: 422,
            statusMessage: "Unprocessable Entity",
            data: result.error.flatten()
        })
    }

    const { recurrence, movements } = result.data

    try {

        return await recurrenceRepository.create(session.session.userId, recurrence, movements)

    } catch (error) {
        console.log("Erro ao criar recorrência" + error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})