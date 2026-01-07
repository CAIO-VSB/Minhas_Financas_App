import { defineStore } from "pinia"
import type { TAccount } from "~/types/account/TAccount.types"

export const useAccountStore = defineStore("account",() => {

    const accounts = ref<TAccount[]>([])
    const errorMessage = ref<string>("")
    const successMessage = ref<boolean>(false)
    const loadingAccounts = ref<boolean>(false)

    const addAccount = async (data: TAccount) => {

        try {

            const response: TAccount = await $fetch("/api/account", {
                method: "POST",
                body: data 
            })

            useNotification().success({
                title: "Sucesso",
                message: "Conta criada com sucesso",
                position: "topCenter"
            })

            accounts.value.push(response)

            successMessage.value = true

            return {success: true}

        } catch (error) {

            errorMessage.value = "Erro inesperado. Por favor, tente novamente mais tarde. " + error

            console.log("Caiu no cacht")
        }
    }

    const getAccounts =  async () => {
        
        try {

            loadingAccounts.value = true

            const response: TAccount[] = await $fetch("/api/account", {
                method: "GET"
            })

            accounts.value = response

            return response

        } catch (error) {

            errorMessage.value =  "Erro inesperado. Por favor, tente novamente mais tarde. " + error

        } finally {

            loadingAccounts.value = false
        }

    }

    return {accounts, addAccount, getAccounts, errorMessage, successMessage, loadingAccounts }

})