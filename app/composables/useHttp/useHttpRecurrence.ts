import type { TRecurrence } from "~~/types/recurrence/TRecurrence"
import { schemaRecurrence } from "~~/schemas/recurrence.schema"
import type z from "zod"

type TRecurrencePayload = z.infer<typeof schemaRecurrence>

export function useHttpRecurrence() {

    const postRecurrence = async (data: TRecurrencePayload) => {
        return $fetch<TRecurrence>("/api/recurrence", {method: "POST", body: data})
    }

    return {
        postRecurrence,
    }
}