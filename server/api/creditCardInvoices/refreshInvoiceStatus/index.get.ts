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

    try {

        await invoiceRepository.refreshInvoiceStatus()
     
    } catch (error) {

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})