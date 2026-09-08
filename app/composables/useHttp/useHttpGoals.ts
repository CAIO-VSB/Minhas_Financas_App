import type { TGoalsPayload } from "~~/schemas/goals.schema"
import type { TGoalsMovementsPayload } from "~~/schemas/goalsMovements.schema"

export function useHttpGoals() {

    const postGoals = (data: TGoalsPayload) => {
        return $fetch("/api/goals", {method: "POST", body: data})
    }

    const getAllGoals = () => {
        return $fetch<TGoalsPayload []>("/api/goals", {method: "GET"})
    }
    
    const patchGoals = (id: number, data: TGoalsPayload) => {
        return $fetch<TGoalsPayload>(`/api/goals/${id}`, {method: "PATCH", body: data})
    }

    const patchArchiveGoals = (id: number, active: boolean) => {
        return $fetch(`/api/goals/archive/${id}`, {method: "PATCH", body: { active }})
    }

    const postMovementGoals = (data: TGoalsMovementsPayload) => {
        return $fetch("/api/goalsMovements", { method: "POST", body: data })
    
    }

    const getMovementGoals = (goalsId: number, month: number, year: number) => {
        return $fetch(`/api/goalsMovements/${goalsId}`, { method: "GET", query: {month, year} })
    }

    const getBalanceForGoals = () => {
        return $fetch("/api/goalsMovements/getForBalance", {method: "GET"})
    }

    const updateMovementsGoals = (id: number, data: TGoalsMovementsPayload) => {
        return $fetch(`/api/goalsMovements/${id}`, {method: "PATCH", body: data})
    }

    const deleteMovementsGoals = (id: number) => {
        return $fetch(`/api/goalsMovements/${id}`, {method: "DELETE"})
    }

    return {
        postGoals,
        getAllGoals,
        patchGoals,
        patchArchiveGoals,
        postMovementGoals,
        getMovementGoals,
        getBalanceForGoals,
        updateMovementsGoals,
        deleteMovementsGoals
    }

}