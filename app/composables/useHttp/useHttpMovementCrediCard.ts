import type { TMovementCreditCardPayload } from "~~/schemas/movementCreditCard.schema"

export function useHttpMovementCreditCard() {

    const postMovementCreditCard = async (data: TMovementCreditCardPayload) => {
        return $fetch<TMovementCreditCardPayload>("/api/crediCardMovements", {method: "POST", body: data})
    }

    return {
       postMovementCreditCard
    }
}