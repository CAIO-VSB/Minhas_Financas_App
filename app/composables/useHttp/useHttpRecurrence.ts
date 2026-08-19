import type { TRecurrence } from "~~/types/recurrence/TRecurrence"
import type { TRecurrencePayload } from "~~/schemas/recurrence.schema"
import type { TMovements } from "~~/types/movements/TMovements"
import type { TMovementsPayload } from "~~/schemas/movements.schema"
import type { TMovementCreditCardPayload } from "~~/schemas/movementCreditCard.schema"

export function useHttpRecurrence() {

    const postRecurrenceMovements = async (data: TRecurrencePayload) => {
        return $fetch<TRecurrence>("/api/recurrence/movements", {method: "POST", body: data})
    }

    const postRecurrenceCreditCard = async (data: TRecurrencePayload) => {
        return $fetch<TRecurrence>("/api/recurrence/credit-card", {method: "POST", body: data})
    }

    const patchMovementsRecurrenceById = async (id:number, data: TMovementsPayload, editingOption?: string, recurrenceId?: number) => {
        return $fetch<TMovements>(`/api/movements/patchMovementsRecurrenceById/${id}`, {method: "PATCH", body: data, query: {editingOption, recurrenceId}},) 
    }
    
    const deleteMovementsRecurrenceById = async (id:number, data: TMovementsPayload, editingOption?: string, recurrenceId?: number) => {
        return $fetch<TMovements>(`/api/movements/patchMovementsRecurrenceById/${id}`, {method: "DELETE", body: data, query: {editingOption, recurrenceId}},) 
    }

    const patchMovementsCreditCardRecurrenceById = async (id: number, data: TMovementCreditCardPayload, editingOption?: string, recurrenceId?: number) => {
        return $fetch(`/api/crediCardMovements/patchRecurrenceCreditCard/${id}`, {method: "PATCH", body: data, query: {editingOption, recurrenceId}})
    }

    return {
        postRecurrenceMovements,
        postRecurrenceCreditCard,
        patchMovementsRecurrenceById,
        deleteMovementsRecurrenceById,
        patchMovementsCreditCardRecurrenceById
    }
}