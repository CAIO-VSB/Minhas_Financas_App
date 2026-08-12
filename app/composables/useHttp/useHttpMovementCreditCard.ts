import type { TMovementCreditCardPayload } from "~~/schemas/movementCreditCard.schema"

export function useHttpMovementCreditCard() {

    const postMovementCreditCard = async (data: TMovementCreditCardPayload) => {
        return $fetch<TMovementCreditCardPayload>("/api/crediCardMovements", {method: "POST", body: data})
    }

    const getByCreditCard = async (month: number, year: number, creditCard: number) => {
        return $fetch<[]>("/api/crediCardMovements", {method: "GET", query: { month, year, creditCard}})
    }

    const getTotalInvoice = async (month: number, year: number, creditCard: number) => {
        return $fetch("/api/crediCardMovements/index.getTotalInvoice", {method: "GET", query: { month, year, creditCard}})
    }

    return {
       postMovementCreditCard,
       getByCreditCard,
       getTotalInvoice
    }
}