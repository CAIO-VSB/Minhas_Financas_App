export type TCreditCard = {
    id?: number,
    name_identifier: string,
    limit_card?: number | null ,
    four_digits?: string | null,
    due_day: number | null,
    closing_day: number | null,
    accounts_id?: number,
    url_logo: string,
    active: boolean
}