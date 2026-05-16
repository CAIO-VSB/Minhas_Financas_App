import type { TAccount } from "~~/types/account/TAccount.types"
import type { TMovements } from "~~/types/movements/TMovements"

export function useHttpAccounts() {

    const getAllAccounts = async () => {
        return await $fetch<TAccount []>("/api/account", {method: "GET"})
    }

    const getAccountsOnlyActive = async () => {
        return await $fetch<TAccount []>("/api/account", {method: "GET", query: {active: true}})
    }

    const getBalanceForAccount = async () => {
        return await $fetch< TAccount []>("/api/account/index.getBalanceForAccount", {method: "GET"})
    }

    const postAccount = async (data: TAccount) => {
        return $fetch<TAccount>("/api/account", {method: "POST", body: data})
    }

    const patchAccount = async (data: TAccount) => {
        return $fetch<TAccount>("/api/account", {method: "PATCH", body: data})
    }


    return {
        postAccount,
        getAllAccounts,
        patchAccount,
        getAccountsOnlyActive,
        getBalanceForAccount
    }
}