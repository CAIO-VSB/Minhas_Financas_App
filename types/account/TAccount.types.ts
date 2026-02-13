export type TAccount = {
    id?: number | undefined,
    user_id?: string,
    name_identifier: string,
    type_account: string,
    name_bank: string,
    url_image: string,
    active: boolean,
    color?: string | undefined,
    name_color: string
}