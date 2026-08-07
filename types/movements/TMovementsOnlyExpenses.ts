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

export type TMovementsOnlyExpenses = {
    id?: number | null
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
    t_despesas_efetivadas?: number | null,
    t_despesas_pendentes?: number | null,
    total_geral_despesas?: null | null,
    total_installments?: number | null,
    type_recurrence?: string | null,
    installment_current?: number | null
}