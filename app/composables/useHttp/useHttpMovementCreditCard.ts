import type { TMovementCreditCardPayload } from "~~/schemas/movementCreditCard.schema"

export function useHttpMovementCreditCard() {

    const postMovementCreditCard = async (data: TMovementCreditCardPayload) => {
        return $fetch<TMovementCreditCardPayload>("/api/crediCardMovements", {method: "POST", body: data})
    }

    const getByCreditCard = async (month: number, year: number, creditCard: number | null) => {
        return $fetch<[]>("/api/crediCardMovements", {method: "GET", query: { month, year, creditCard}})
    }

    const allMovementsCreditCard = async () => {
        return $fetch<[]>("/api/crediCardMovements/getAllMovementsCreditCard", {method: "GET"})
    }

    const getTotalInvoice = async (month: number, year: number, creditCard: number) => {
        return $fetch("/api/crediCardMovements/index.getTotalInvoice", {method: "GET", query: { month, year, creditCard}})
    }

    const patchMovementCardById = async (id: number, data: TMovementCreditCardPayload, choice: string | null) => {
        return $fetch(`/api/crediCardMovements/patchMovementCardById/${id}`, {method: "PATCH", body: data, query: {choice}})
    }


    return {
       postMovementCreditCard,
       getByCreditCard,
       getTotalInvoice,
       patchMovementCardById,
       allMovementsCreditCard,
    }
}