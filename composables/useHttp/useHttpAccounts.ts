import type { TAccount } from "~/types/account/TAccount.types"

export function useHttpAccounts() {

    const getAccounts = async () => {
        return await $fetch<TAccount []>("/api/account", {method: "GET"})
    }

    const postAccount = async (data: TAccount) => {
        return $fetch<TAccount>("/api/account", {method: "POST", body: data})
    }

    const patchAccount = async (data: TAccount) => {
        return $fetch<TAccount>("/api/account", {method: "PATCH", body: data})
    }


    return {
        postAccount,
        getAccounts,
        patchAccount
    }
}