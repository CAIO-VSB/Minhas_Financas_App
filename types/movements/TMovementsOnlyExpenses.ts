export type TMovementsOnlyExpenses = {
    id?: number | null
    type_transaction: string | null,
    value_transaction: number | null, 
    date_transaction: Date | null,
    description_transaction: string,
    categorie_id: number | null,
    accounts_id: number | null,
    observation?: string | null,
    url_recibo?: string | null,
    status_transaction: string | null,
    is_deleted?: boolean | null,
    t_despesas_efetivadas?: number | null,
    t_despesas_pendentes?: number | null,
    total_geral_despesas?: null | null 
}