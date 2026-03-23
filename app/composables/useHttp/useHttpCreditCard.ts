import type { TCreditCard } from "~~/types/credit_card/TCredit-card"


export function useHttpCreditsCards() {

    const postCreditCard = async (data: TCreditCard) => {
        return $fetch<TCreditCard>("/api/creditCard", {method: "POST", body: data})
    }

    const getCreditCard = async () => {
        return $fetch<TCreditCard []>("/api/creditCard", {method: "GET"})
    }

    const patchCreditCard = async (data: TCreditCard) => {
        return $fetch<TCreditCard>("/api/creditCard", {method: "PATCH", body: data})
    }

    return {
        postCreditCard,
        getCreditCard,
        patchCreditCard
    }
}