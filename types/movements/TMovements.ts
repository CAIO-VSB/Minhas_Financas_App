export type TTypeTransaction =
    | "receita"
    | "despesa"
    | "transferencia_entrada"
    | "transferencia_saida"

export type TStatusTransaction =
    | "pendente"
    | "recebido"
    | "pago"
    | "entrada"
    | "saida"

export type TMovements = {
    id?: number | null,
    type_transaction: TTypeTransaction,
    value_transaction: number | null, 
    date_transaction: Date | null,
    description_transaction: string,
    categorie_id: number | null,
    accounts_id: number | null,
    observation?: string | null,
    url_recibo?: string | null,
    status_transaction: TStatusTransaction,
    is_deleted?: boolean | null,
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
    installment_current?: number | null,
    total_installments?: number | null,
    type_recurrence?: string | null
}

export type TMovementsWithTransfer = TMovements & {
    account_origin?: number | null,
    account_destination?: number | null,
    transfer_id?: number | null
}