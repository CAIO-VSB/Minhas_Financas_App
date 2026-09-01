import { auth } from "~~/auth"
import { invoiceRepository } from "~~/server/repositories/invoices.repository"

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

    const creditCardId = Number(getRouterParam(event, "id"))

    try {

        return await invoiceRepository.getNextOpenPeriod(creditCardId)

    } catch (error) {

        console.log("Erro ao buscar mes da fatura atual", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})