export type TCreditCard = {
    name_identifier: string,
    limit_card?: number,
    four_digits?: string | null,
    due_day: number | null,
    closing_day: number | null,
    accounts_id?: number,
    url_logo: string,
    active: boolean
}