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

    const getOnlyRevenues = async (month: number, year: number) => {
        return $fetch<TMovementsOnlyRenevue []>("/api/movements/index.onlyGetRevenues", {method: "GET", query: { month, year}})
    }

    const getOnlyExpenses = async (month: number, year: number) => {
        return $fetch<TMovementsOnlyExpenses []>("/api/movements/index.onlyGetExpenses", {method: "GET", query: { month, year}})
    }

    return {
        postMovements,
        getMoviments,
        getOnlyRevenues,
        getOnlyExpenses
    }
}