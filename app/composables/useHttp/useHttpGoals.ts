import type { TGoalsPayload } from "~~/schemas/goals.schema"

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

    return {
        postGoals,
        getAllGoals,
        patchGoals,
        patchArchiveGoals
    }

}