export type TAction =
    | "edit"
    | "delete"
    | "arquivo"
    | "efetivar"

export type TOptionAction = {
    title: string
    icon: string
    value: TAction
}