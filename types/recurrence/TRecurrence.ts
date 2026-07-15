export type TRecurrence = {
    id?: number | null,
    userId?: string | null,
    value_recurrence: number | null,
    description_recurrence: string | null,
    categorie_id: number | null,
    accounts_id: number | null,
    type_recurrence: string | null,
    frequency_recurrence: string | null,
    total_installments: number | null,
    day_maturity: Date | null,
    is_active?: boolean
}