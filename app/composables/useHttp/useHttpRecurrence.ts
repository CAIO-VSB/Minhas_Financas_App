import type { TRecurrence } from "~~/types/recurrence/TRecurrence"
import type { TRecurrencePayload } from "~~/schemas/recurrence.schema"

export function useHttpRecurrence() {

    const postRecurrenceMovements = async (data: TRecurrencePayload) => {
        return $fetch<TRecurrence>("/api/recurrence/movements", {method: "POST", body: data})
    }

    const postRecurrenceCreditCard = async (data: TRecurrencePayload) => {
        return $fetch<TRecurrence>("/api/recurrence/credit-card", {method: "POST", body: data})
    }

    return {
        postRecurrenceMovements,
        postRecurrenceCreditCard
    }
}