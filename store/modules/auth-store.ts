import { defineStore } from "pinia"
import type { TUser } from "../../types/auth/Tauth.types";
import type { TLoginForm, TRegisterForm } from "../../types/user/Tuser.types";


export const useAuthStore = defineStore('auth', () => {
    const { $authClient } = useNuxtApp()
    const user = ref<TUser>()
    const isAuthenticated = ref<boolean>(false)
    const disableButton = ref<boolean>(false)
    const rateLimitUntil = ref<number | null>(null)

    const { notifyError, notifyInfo, notifySuccess } = useNotify()

    const setUser = async (userData: TUser): Promise<void> => {
        user.value = userData
        sessionStorage.setItem("user", JSON.stringify(userData))
    }
    
    const setAuthenticated = async (value: boolean): Promise<void> => {
        isAuthenticated.value = value
        sessionStorage.setItem('isAuthenticated', JSON.stringify(value))
    }

    const lockButtonFor = (ms: number) => {
        disableButton.value = true
        rateLimitUntil.value = Date.now() + ms

        sessionStorage.setItem("rateLimitUntil", String(rateLimitUntil.value))

        setTimeout(() => {
            disableButton.value = false
            rateLimitUntil.value = null
            sessionStorage.removeItem("rateLimitUntil")
        }, ms)
    }

    const restoreRateLimit = () => {

        const storeUntil = sessionStorage.getItem("rateLimitUntil")

        console.log(storeUntil)

        if (!storeUntil) return

        //Tempo restante       
        const remaining = Number(storeUntil) - Date.now()

        if (remaining <= 0) {
            disableButton.value = false
            sessionStorage.removeItem("rateLimitUntil")
            return
        }

        disableButton.value = true

        notifyInfo(
            "Limite de tentativas atingido",
            `Por segurança, novas tentativas foram temporariamente bloqueadas. Tente novamente em ${remaining.toLocaleString("pt-br").split(".")[0]} segundos...`,
            remaining,
            false,
            false
        )

        setTimeout(() => {
            disableButton.value = false
            rateLimitUntil.value = null
            sessionStorage.removeItem("rateLimitUntil")
        }, remaining);

    }

    restoreRateLimit()

    const login = async (data: TLoginForm) => {
        try {
            const response = await $authClient.signIn.email(data, {
                onError(context) {
                    if (context.error.status === 401) {
                        notifyError("Não foi possível fazer login", "E-mail ou senha incorretos. Verifique os dados e tente novamente", 7000)
                        return
                    } else {
                        handleErrorApplication(context.error.status)
                        lockButtonFor(30000)
                        return
                    }
                }
            })

            const token = response.data?.token

            if (token) {

                if (response.data?.user) {
                    await setUser(response.data.user)
                    await setAuthenticated(true)
                    return {success: true, message: "Validação realizada com sucesso"}
                }
            } 

        } catch (error) {
            notifyError("Erro interno", "Ocorreu um erro inesperado. Tente novamente em alguns instantes.")
        }
    }

    const loginGoogle = async () => {

        const data = await $authClient.signIn.social({
            provider: "google",
            callbackURL: "http://localhost:3000/dashboard"
        })

        return data

    }

    const loginDiscord = async () => {

        const data = await $authClient.signIn.social({
            provider: "discord",
            callbackURL: "http://localhost:3000/dashboard"
        })

        return data
    }

    const register = async (data: TRegisterForm) => {

        try {

            await $authClient.signUp.email(data, {
                onError(context) {
                    if (context.error.status === 422) {
                        notifyError("E-mail já cadastrado", "Este endereço de e-mail já está em uso. Utilize outro e-mail ou faça login.")
                    }
                },

                onSuccess() {
                    notifySuccess("E-mail enviado", "Enviamos um e-mail de verificação para sua caixa de entrada. Caso não o encontre, verifique a pasta de spam.")
                }
            })

            return {success: true, message: "Conta criada com sucesso"}

        } catch (error) {
            notifyError("Erro interno", "Ocorreu um erro inesperado. Tente novamente em alguns instantes.")
        }
    }

    const logout  = async () => {
        await $authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    navigateTo({ path: "/login-page" });
                }
            }
        })
    }

    return { lockButtonFor, login, loginGoogle, loginDiscord, register, logout, isAuthenticated, user, disableButton }

})