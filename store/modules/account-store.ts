

export const useAccountStore = defineStore("messages",() => {

    const errorMessage = ref<string>("")
    const controllerMessageError = ref<boolean>(false)

    const showMessage = (message: string, controller: boolean) => {
        errorMessage.value = message
        controllerMessageError.value = controller
    }

  
    return { showMessage }

})