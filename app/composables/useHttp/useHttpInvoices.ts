export function useHttpInvoices() {

    const patchPaymentTotal = async (dataPayment: string, accountsId: number, invoiceId: number, totalInvoice: number) => {
        return $fetch(`/api/creditCardInvoices/paymentTotal/${invoiceId}`, {method: "PATCH", query: {dataPayment: dataPayment, accountsId: accountsId, invoiceId: invoiceId, totalInvoice: totalInvoice} })
    }

    const patchPaymentPartial = async (dataPayment: string, accountsId: number, invoiceId: number, totalInvoice: number, totalPaid: number) => {
        return $fetch(`/api/creditCardInvoices/paymentPartial/${invoiceId}`, {method: "PATCH", query: {dataPayment: dataPayment, accountsId: accountsId, invoiceId: invoiceId, totalInvoice: totalInvoice, totalPaid: totalPaid} })
    }

    const patchPaymentAdvance = async (dataPayment: string, accountsId: number, invoiceId: number, totalInvoice: number, totalPaid: number, invoice_month: number,invoice_year: number, creditCardId: number, closingDay: number) => {
        return $fetch(`/api/creditCardInvoices/paymentAdvance/${invoiceId}`, {method: "PATCH", query: {dataPayment: dataPayment, accountsId: accountsId, invoiceId: invoiceId, totalInvoice: totalInvoice, totalPaid: totalPaid, invoice_month: invoice_month, invoice_year: invoice_year, creditCardId: creditCardId, closingDay: closingDay} })
    }

    return {
        patchPaymentTotal,
        patchPaymentPartial,
        patchPaymentAdvance
    }
}