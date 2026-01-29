import { schemaAccount } from "~/schemas/account.schema"
import { singIn, singUp, passwordValidate, emailValidate } from "~/schemas/auth.schema"
import { schemaCategories } from "~/schemas/categories.schema"
import type { TAccount } from "~/types/account/TAccount.types"
import type { TUser } from "~/types/auth/Tauth.types"
import type { TCategorie } from "~/types/categorie/TCategorie"
import type { TRecoveryForm, TLoginForm, TResetForm } from "~/types/user/Tuser.types"

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

    const validateSchemaSignUp = (data: TUser) => {

        const result = singUp.safeParse(data)

        if (!result.success) {
            console.log("Erro ao validar e criar usuário", result.error)
            return {success: false}
        } 

        console.log("Validação realizada com sucesso", result.data)
        return {success: true, data: result.data}

    }

    const validateSchemaSignIn = (data: TLoginForm): object => {

        const result = singIn.safeParse(data)

        if (!result.success) {
            console.log("Erro ao tentar fazer login (objeto inválido)", result.error)
            return {success: false}
        } 

        console.log("Objeto a ser enviado para fazer login", result.data)
        return {success: true}

    }

    const validateSchemaPassword = (data: TResetForm) => {

        const result = passwordValidate.safeParse(data)

        if (!result.success) {
            console.log("Erro ao validar as senhas")
            return { success: false }
        } 

        console.log("Obejto ao ser enviado para back", result.data)

        return {success: true}

    }

    const validateSchemaEmail = (data: TRecoveryForm) => {

        const result = emailValidate.safeParse(data)

        if (!result.success) {
            console.log("Erro ao validar o formato do email", result.error.message)
            return { success: false }
        }
        
        console.log("Obejto ao ser enviado para back", result.data)
        return {success: true}

    }

    const validateSchemaAccount = (data: TAccount) => {

        const result = schemaAccount.safeParse(data)

        if (!result.success) {
            console.log("Erro ao validar o formato da conta", result.error.message)
            return { success: false }
        }

        console.log("Tudo certo com os dados, nada vazio", result.data)
        return {success: true}
    }

    const validateSchemaCategorie = (data: TCategorie) => {

        const result = schemaCategories.safeParse(data)

        if (!result.success) {
            console.log("Erro ao validar o formato da categoria", result.error.message)
            return { success: false }
        }

        console.log("Tudo certo com os dados, nada vazio", result.data)
        return {success: true}
    }

    return {
        nameRules,
        emailRules,
        passwordRules,
        validateSchemaSignIn,
        validateSchemaSignUp,
        validateSchemaPassword,
        validateSchemaEmail,
        validateSchemaAccount,
        validateSchemaCategorie
    }

}