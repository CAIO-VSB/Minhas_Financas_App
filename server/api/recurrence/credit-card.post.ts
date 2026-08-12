import { auth } from "~~/auth"
import { z } from "zod"
import { schemaMovementCreditCard } from "~~/schemas/movementCreditCard.schema"
import { schemaRecurrence } from "~~/schemas/recurrence.schema"
import { recurrenceRepository } from "~~/server/repositories/recurrence.repository"

const schemaUnified = z.object({
    recurrence: schemaRecurrence,
    movementsCreditCard: z.array(schemaMovementCreditCard),
    
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

    console.log("Errrrrrrrrr " + result.error)

    if (!result.success) {
        throw createError({
            status: 422,
            statusMessage: "Unprocessable Entity",
            data: result.error.flatten()
        })
    }

    const { recurrence, movementsCreditCard } = result.data

    try {

        return await recurrenceRepository.createRecorrenceCreditCard(session.session.userId, recurrence, movementsCreditCard)

    } catch (error) {
        console.log("Erro ao criar recorrência" + error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})