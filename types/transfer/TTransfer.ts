export type TTransfer = {
    id?: number,
    user_id?: string,
    value_transfer?: number ,
    date_transfer: string | null,
    account_destination: number | null,
    account_origin: number | null,
    observation?: string | null,
    is_deleted?: boolean

    logo_origem?: string,
    logo_destino?: string,
    account_origin_name?: string,
    account_destination_name?: string 
}