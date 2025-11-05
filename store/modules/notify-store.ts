import { defineStore } from "pinia"

export const useNotify = defineStore("notify", () => {
    const isVisible = ref<boolean>(false)
    const messageNotify = ref<string>("")

    const handleMessageErrorMiddleware = () => {
        isVisible.value = true
        messageNotify.value = "Acesso não autorizado. Faça login para continuar."
    } 

    return { handleMessageErrorMiddleware, isVisible, messageNotify }

})