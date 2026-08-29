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
        
    const { invoiceId } = getQuery(event)

    const invoiceIdFormated = Number(invoiceId)


    if ( !invoiceIdFormated ) {
        throw createError({
            status: 404,
            statusMessage: "Id da fatura está ausente ou incorreto"
        })
    } 

    try {

        return await invoiceRepository.updateReopenInvoice(session.session.userId, invoiceIdFormated)

    } catch (error) {
        console.log("Erro ao reabrir fatura" + error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})