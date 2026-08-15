import { addMonths } from "date-fns"

export default function calculateInvoiceMonth(purchaseDate: Date, closingDay: number): { month: number, year: number } {
    
    const purchaseDay = purchaseDate.getDate()

    if (purchaseDay <= closingDay) {
        return {
            month: purchaseDate.getMonth() + 1,
            year: purchaseDate.getFullYear()
        }
    } else {
        const nextMonth = addMonths(purchaseDate, 1)
        return {
            month: nextMonth.getMonth() + 1,
            year: nextMonth.getFullYear()
        }
    }

}