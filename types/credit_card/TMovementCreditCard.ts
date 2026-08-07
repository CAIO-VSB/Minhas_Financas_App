
export type TMovementCreditCard = {
    id?: number,
    credit_cards_id: number | null,
    invoice_id: number | null,
    categorie_id: number | null,
    description_credit: string,
    value_transaction: number | null,
    purchase_date: Date,
    installment_number?: number,
    installment_total?: number,
    recurrence_id?: number,
    observation: string | null,
    is_deleted?: boolean | null,
    closingDay?: number | null
}