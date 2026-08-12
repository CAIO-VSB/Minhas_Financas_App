

export function calculateInvoiceDates(closingDay: number, dueDay: number) {

    if (closingDay < dueDay) {
        return {
            closingDay,
            dueDay
        }
    } else {
        
    }

}