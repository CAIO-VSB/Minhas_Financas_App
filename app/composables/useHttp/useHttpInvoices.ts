export function useHttpInvoices() {

    const patchPaymentTotal = async (dataPayment: string, accountsId: number, invoiceId: number, totalInvoice: number) => {
        return $fetch(`/api/creditCardInvoices/paymentTotal/${invoiceId}`, {method: "PATCH", query: {dataPayment: dataPayment, accountsId: accountsId, invoiceId: invoiceId, totalInvoice: totalInvoice} })
    }

    const patchPaymentPartial = async (dataPayment: string, accountsId: number, invoiceId: number, totalInvoice: number, totalPaid: number) => {
        return $fetch(`/api/creditCardInvoices/paymentPartial/${invoiceId}`, {method: "PATCH", query: {dataPayment: dataPayment, accountsId: accountsId, invoiceId: invoiceId, totalInvoice: totalInvoice, totalPaid: totalPaid} })
    }

    return {
        patchPaymentTotal,
        patchPaymentPartial
    }
}