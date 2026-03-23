import { schemaAccount } from "~~/schemas/account.schema"
import { singIn, singUp, passwordValidate, emailValidate } from "~~/schemas/auth.schema"
import { schemaCategories } from "~~/schemas/categories.schema"
import type { TAccount } from "~~/types/account/TAccount.types"
import type { TUser } from "~~/types/auth/Tauth.types"
import type { TCategorie } from "~~/types/categorie/TCategorie"
import type { TCreditCard } from "~~/types/credit_card/TCredit-card"
import type { TRecoveryForm, TLoginForm, TResetForm } from "~~/types/user/Tuser.types"
import { schemaCreditCard } from "~~/schemas/creditCard.schema"

//Tipo para validar o retorno de cada função
type ValidateResult<T> = 
    | { success: true; data: T}
    | { success: false }

export function useValidateSchemas() {

    const validateSchemaSignUp = (data: TUser): ValidateResult<TUser> => {

        const result = singUp.safeParse(data)

        if (!result.success) {
            console.log("Erro ao validar e criar usuário", result.error)
            return {success: false}
        } 

        return {success: true, data: result.data}

    }

    const validateSchemaSignIn = (data: TLoginForm): ValidateResult<TLoginForm> => {

        const result = singIn.safeParse(data)

        if (!result.success) {
            console.log("Erro ao tentar fazer login (objeto inválido)", result.error)
            return {success: false}
        } 

        return {success: true, data: result.data}

    }

    const validateSchemaPassword = (data: TResetForm): ValidateResult<TResetForm> => {

        const result = passwordValidate.safeParse(data)

        if (!result.success) {
            console.log("Erro ao validar as senhas")
            return { success: false }
        } 

        return {success: true, data: result.data}

    }

    const validateSchemaEmail = (data: TRecoveryForm):ValidateResult<TRecoveryForm> => {

        const result = emailValidate.safeParse(data)

        if (!result.success) {
            console.log("Erro ao validar o formato do email", result.error.message)
            return { success: false }
        }
        
        return {success: true, data: result.data}

    }

    const validateSchemaAccount = (data: TAccount):ValidateResult<TAccount> => {

        const result = schemaAccount.safeParse(data)

        if (!result.success) {
            console.log("Erro ao validar o formato da conta", result.error.message)
            return { success: false }
        }

        return {success: true, data: result.data}
    }

    const validateSchemaCategorie = (data: TCategorie): ValidateResult<TCategorie> => {

        const result = schemaCategories.safeParse(data)

        if (!result.success) {
            console.log("Erro ao validar o formato da categoria", result.error.message)
            return { success: false }
        }

        return {success: true, data: result.data}
    }

    const validateShemaCrediCard = (data: TCreditCard):ValidateResult<TCreditCard> => {

        console.log("Objeto que chegou na composable", toRaw(data))

        const result = schemaCreditCard.safeParse(data)

        if (!result.success) {
            console.log("Erro validar o formato cartao de credito", result.error)
            return {success: false}
        }

        return {success: true, data: result.data}
    }


    return {
        validateSchemaAccount,
        validateSchemaCategorie,
        validateSchemaEmail,
        validateSchemaPassword,
        validateSchemaSignIn,
        validateSchemaSignUp,
        validateShemaCrediCard
    }

}