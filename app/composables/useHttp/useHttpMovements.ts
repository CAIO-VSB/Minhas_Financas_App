import type { TMovements, TMovementsSummary } from "~~/types/movements/TMovements"
import type { TMovementsOnlyRenevue } from "~~/types/movements/TMovementsOnlyRevenue"
import type { TMovementsOnlyExpenses } from "~~/types/movements/TMovementsOnlyExpenses"
import { schemaMovements } from "~~/schemas/movements.schema"
import type z from "zod"

type TMovementsPaylodad = z.infer<typeof schemaMovements>

export function useHttpMovements() {

    const postMovements = async (data: TMovementsPaylodad) => {
        return $fetch<TMovements>("/api/movements", {method: "POST", body: data})
    }

    const getMoviments = async (month: number, year: number) => {
        return $fetch<TMovementsSummary []>("/api/movements", {method: "GET", query: { month, year}})
    }

    const getOnlyRevenues = async (month: number, year: number) => {
        return $fetch<TMovementsOnlyRenevue []>("/api/movements/index.onlyGetRevenues", {method: "GET", query: { month, year}})
    }

    const getOnlyExpenses = async (month: number, year: number) => {
        return $fetch<TMovementsOnlyExpenses []>("/api/movements/index.onlyGetExpenses", {method: "GET", query: { month, year}})
    }

    const getMovimentsByFilter = async (start_day: string, end_day: string, categorie_id: number[], accounts_id: number[], situation: string, for_type: string[]) => {
        return $fetch<TMovements []>("/api/movements/index.getMovementsByFilter", {method: "POST", body: { start_day: start_day, end_day: end_day, categorie_id, accounts_id, situation, for_type }})
    }

    const getMovimentsOnlyExpensesByFilter = async (start_day: string, end_day: string, categorie_id: number[], accounts_id: number[], situation: string, for_type: string[]) => {
        return $fetch<TMovementsOnlyExpenses []>("/api/movements/index.getOnlyExpensesByFilter", {method: "POST", body: { start_day: start_day, end_day: end_day, categorie_id, accounts_id, situation, for_type }})
    }

    const getMovimentsOnlyRevenuesByFilter = async (start_day: string, end_day: string, categorie_id: number[], accounts_id: number[], situation: string, for_type: string[]) => {
        return $fetch<TMovementsOnlyRenevue []>("/api/movements/index.getOnlyRevenuesByFilter", {method: "POST", body: { start_day: start_day, end_day: end_day, categorie_id, accounts_id, situation, for_type }})
    }

    const getCurrentBalance = async () => {
        return $fetch<Pick<TMovementsSummary, "saldo_atual"> []>("/api/movements/index.getOnlyCurrentBalance", {method: "GET"})
    }

    const patchMovementsById = async (id:number, data: TMovementsPaylodad) => {
        return $fetch<TMovements>(`/api/movements/${id}`, {method: "PATCH", body: data},) 
    }


    return {
        postMovements,
        getMoviments,
        getOnlyRevenues,
        getOnlyExpenses,
        patchMovementsById,
        getCurrentBalance,
        getMovimentsByFilter,
        getMovimentsOnlyExpensesByFilter,
        getMovimentsOnlyRevenuesByFilter
    }
}