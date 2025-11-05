import { singIn, singUp, passwordValidate, emailValidate } from "~/schemas/auth.schema"
import type { User } from "~/types/auth/types"
import type { RecoveryForm, LoginForm, ResetForm } from "~/types/user/types"

export function useValidateFields() {

    const regexEmail = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i

    const nameRules = ref([
        (val: string) => !!val || "Campo nome é obrigatório",
        (val: string) => (val && val.length <= 55) || "Nome não pode conter mais de 55 caracteres"
    ])

    const emailRules = ref([
        (val: string) => !!val || "Campo e-mail é obrigatório",
        (val: string) => (regexEmail.test(val)) || "O formato do e-mail é inválido"
    ])

    const passwordRules = ref([
        (val: string) => !!val || "Campo senha é obrigatório",
        (val: string) => (val && val.length >= 8) || "A senha deve conter no minímo 8 caracteres"
    ])

    const validateSchemaSignUp = (data: User) => {

        const result = singUp.safeParse(data)

        if (!result.success) {
            console.log("Erro ao validar e criar usuário", result.error)
            return {success: false}
        } 

        console.log("Validação realizada com sucesso", result.data)
        return {success: true, data: result.data}

    }

    const validateSchemaSignIn = (data: LoginForm): object => {

        const result = singIn.safeParse(data)

        if (!result.success) {
            console.log("Erro ao tentar fazer login (objeto inválido)", result.error)
            return {success: false}
        } 

        console.log("Objeto a ser enviado para fazer login", result.data)
        return {success: true}

    }

    const validateSchemaPassword = (data: ResetForm) => {

        const result = passwordValidate.safeParse(data)

        if (!result.success) {
            console.log("Erro ao validar as senhas")
            return { success: false }
        } 

        console.log("Obejto ao ser enviado para back", result.data)

        return {success: true}

    }

    const validateSchemaEmail = (data: RecoveryForm) => {

        const result = emailValidate.safeParse(data)

        if (!result.success) {
            console.log("Erro ao validar o formato do email", result.error.message)
            return { success: false }
        }
        
        console.log("Obejto ao ser enviado para back", result.data)
        return {success: true}
        

    }

    return {
        nameRules,
        emailRules,
        passwordRules,
        validateSchemaSignIn,
        validateSchemaSignUp,
        validateSchemaPassword,
        validateSchemaEmail
    }

}