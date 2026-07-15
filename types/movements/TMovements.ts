export type TMovements = {
    id?: number
    type_transaction: string,
    value_transaction: number | null, 
    date_transaction: Date,
    description_transaction: string,
    categorie_id: number | null,
    accounts_id: number | null,
    observation?: string | null,
    url_recibo?: string | null,
    status_transaction: string,
    is_deleted?: boolean,
    recurrence_id?: number | null
    year_date?: number | null,
    month_date?: number | null
}

export type TMovementsSummary = TMovements & {
    t_despesas?: number | null,
    t_receitas?: number | null,
    balanco_mensal?: number | null,
    saldo_atual?: number | null,
    t_receitas_efetivadas?: number | null,
    t_receitas_pendentes?: number | null,
    total_geral_receitas?: number | null,
}

export type TMovementsWithTransfer = TMovements & {
    account_origin?: number | null,
    account_destination?: number | null,
    transfer_id?: number | null
}