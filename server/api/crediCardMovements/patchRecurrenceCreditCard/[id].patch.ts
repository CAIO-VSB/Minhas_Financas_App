import { auth } from "~~/auth"
import { schemaMovementCreditCard } from "~~/schemas/movementCreditCard.schema"
import { recurrenceRepository} from "~~/server/repositories/recurrence.repository"

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
        
    const result = await readValidatedBody(event, body => schemaMovementCreditCard.safeParse(body))

    if (!result.success) {
        throw createError({
            status: 422,
            statusMessage: "Unprocessable Entity",
            data: result.error.flatten()
        })
    }

    const id = Number(getRouterParam(event, "id"))

    const { editingOption, recurrenceId} = getQuery(event)

    const optionEditingFormated = String(editingOption)

    const recurrenceIdFormated = Number(recurrenceId)

    console.log("ID recurrence chegando " + recurrenceIdFormated)

    const userId = session.session.userId

    if (!id || Number.isNaN(id)) {
        throw createError({
            status: 404,
            statusMessage: "Movimentação não encontrada"
        })
    }

    try {

        return await recurrenceRepository.updateOnlyMovementRecurrenceCreditCard(id, result.data, optionEditingFormated, userId, recurrenceIdFormated)

    } catch (error) {
        console.log("Erro ao editar movimentação do cartão de credito " + error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})