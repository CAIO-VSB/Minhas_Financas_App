import { singUp } from "~/schemas/auth.schema"
import type { User } from "~/types/typeUser"


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

    const validateSingUp = (data: User) => {
        const result = singUp.safeParse(data)

        if (!result.success) {
            console.log("Erro ao validar e criar usuário", result.error)
        } else {
            console.log("Validação realizada com sucesso", result.data)
        }
    }

    return {
        nameRules,
        emailRules,
        passwordRules,
        validateSingUp
    }

}