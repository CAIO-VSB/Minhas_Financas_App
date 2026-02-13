import { defineStore } from "pinia"
import { authClient } from "~/lib/auth-client";
import type { TUser } from "~/types/auth/Tauth.types";
import type { TLoginForm, TRegisterForm } from "~/types/user/Tuser.types";


export const useAuthStore = defineStore('auth', () => {
    const user = ref<TUser>()
    const isAuthenticated = ref<boolean>(false)
    const typeMessage = ref<string>("")
    const dialog= ref<boolean>(false)
    const activeMessageError = ref<boolean>(false)
    const activeMessageAlert = ref<boolean>(false)

    const setUser = async (userData: TUser): Promise<void> => {
        user.value = userData
        sessionStorage.setItem("user", JSON.stringify(userData))
    }
    
    const setAuthenticated = async (value: boolean): Promise<void> => {
        isAuthenticated.value = value
        sessionStorage.setItem('isAuthenticated', JSON.stringify(value))
    }

    const login = async (data: TLoginForm) => {
        try {
            const response = await authClient.signIn.email(data, {
                onError(context) {
                    console.log("O status retorado é esse", context.error.status)
                    if (context.error.status === 403) {
                        typeMessage.value = "E-mail não verificado. Verifique sua caixa de entrada."
                        activeMessageAlert.value = true
                        return 
                    }

                    if (context.error.status === 401) {
                        typeMessage.value = "Credenciais inválidas. Tente novamente."
                        activeMessageError.value = true
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
                } else {
                    console.log("Usuário ausente")
                } 
            } else {
                console.log("Token ausente. Ou seja, usuário inválido")
            }

        } catch (error) {

            console.log("Erro ao fazer login" + error)

        }
    }

    const loginGoogle = async () => {

        await authClient.signIn.social({
            provider: "google",
            callbackURL: "http://localhost:3000/dashboard"
        })

    }

    
    const register = async (data: TRegisterForm) => {

        try {

            activeMessageAlert.value = false
            
            await authClient.signUp.email(data, {
                onError(context) {
                    if (context.error.status === 422) {
                        activeMessageAlert.value = true
                        typeMessage.value = "E-mail já existe. Use outro e-mail"
                    }
                },
                onSuccess() {
                    dialog.value = true
                }
            })

            return {success: true, message: "Conta criada com sucesso"}

        } catch (error) {

            console.log("Erro ao criar conta", error)
            dialog.value = true
            
        }
    }

    const logout  = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    navigateTo({ path: "/login-page" });
                }
            }
        })
    }

    return { login, loginGoogle, register, logout, dialog, isAuthenticated, activeMessageAlert, activeMessageError, typeMessage, user }

}, {
    persist:{
        storage: piniaPluginPersistedstate.sessionStorage()
    }
})