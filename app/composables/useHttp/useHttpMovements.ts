import type { TMovements } from "~~/types/movements/TMovements"
import type { TMovementsOnlyRenevue } from "~~/types/movements/TMovementsOnlyRevenue"
import type { TMovementsOnlyExpenses } from "~~/types/movements/TMovementsOnlyExpenses"


export function useHttpMovements() {

    const postMovements = async (data: TMovements) => {
        return $fetch<TMovements>("/api/movements", {method: "POST", body: data})
    }

    const getMoviments = async (month: number, year: number) => {
        return $fetch<TMovements []>("/api/movements", {method: "GET", query: { month, year}})
    }

    const getOnlyRevenues = async () => {
        return $fetch<TMovementsOnlyRenevue []>("/api/movements/index.onlyGetRevenues", {method: "GET"})
    }

    const getOnlyExpenses = async () => {
        return $fetch<TMovementsOnlyExpenses []>("/api/movements/index.onlyGetExpenses", {method: "GET"})
    }

    return {
        postMovements,
        getMoviments,
        getOnlyRevenues,
        getOnlyExpenses
    }
}