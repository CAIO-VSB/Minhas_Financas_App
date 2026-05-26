export type TMovementsByFilter = {
    start_day: string | null,
    end_day: string | null,
    categorie_id: number[] | null,
    accounts_id: number[] | null,
    situation: string | null, 
    for_type: string[] | null
}