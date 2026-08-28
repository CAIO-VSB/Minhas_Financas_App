import { number } from "zod"
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
        
    const { dataPayment, accountsId, invoiceId, totalInvoice } = getQuery(event)

    const dataPaymentFormated = String(dataPayment)
    const accountsIdFormated = Number(accountsId)
    const invoiceIdFormated = Number(invoiceId)
    const totalInvoiceFormated = Number(totalInvoice)

    if (!dataPaymentFormated || !accountsIdFormated || !invoiceIdFormated || !totalInvoiceFormated) {
        throw createError({
            status: 404,
            statusMessage: "Data do pagamento, id do cartão, id da fatura ou total da fatura incorretos"
        })
    } 

    try {

        return await invoiceRepository.updateFullPayment(session.session.userId, dataPaymentFormated, totalInvoiceFormated, accountsIdFormated, invoiceIdFormated)

    } catch (error) {
        console.log("Erro ao lancar pagamento da fatura" + error)
        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})