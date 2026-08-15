
export type TMovementCreditCard = {
    id?: number,
    credit_card_id: number | null,
    invoice_id: number | null,
    categorie_id: number | null,
    description_credit: string,
    value_transaction: number | null,
    purchase_date: Date | null,
    installment_number?: number,
    installment_total?: number,
    total_installments?: number,
    recurrence_id?: number,
    observation: string | null,
    status_movement: "estornada" | "deletada" | "ativa",
    closingDay?: number | null,
    invoice_month: number | null,
	invoice_year: number | null
}