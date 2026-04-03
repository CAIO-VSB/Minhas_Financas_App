import type { TCreditCard } from "~~/types/credit_card/TCredit-card"


export function useHttpCreditsCards() {

    const postCreditCard = async (data: TCreditCard) => {
        return $fetch<TCreditCard>("/api/creditCard", {method: "POST", body: data})
    }

    const getCreditCardOnlyActive = async () => {
        return $fetch<TCreditCard []>("/api/creditCard", {method: "GET", query: {active: true}})
    }

    const getCreditCardOnlyDisable = async () => {
        return $fetch<TCreditCard []>("/api/creditCard", {method: "GET", query: {active: false}})
    }

    const patchCreditCard = async (data: TCreditCard) => {
        return $fetch<TCreditCard>("/api/creditCard", {method: "PATCH", body: data})
    }

    return {
        postCreditCard,
        getCreditCardOnlyActive,
        patchCreditCard,
        getCreditCardOnlyDisable
    }
}