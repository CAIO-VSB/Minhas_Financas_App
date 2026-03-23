
export function useValidateFields() {

    const regexEmail = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i

    const nameRules = ref([
        (val: string) => !!val || "Campo nome é obrigatório",
        (val: string) => (val && val.length <= 55) || "Nome não pode conter mais de 55 caracteres",
        (val: string) => (val && val.length > 2) || "Nome precisa ter no minímo 3 caracteres"
    ])

    const emailRules = ref([
        (val: string) => !!val || "Campo e-mail é obrigatório",
        (val: string) => (regexEmail.test(val)) || "O formato do e-mail é inválido"
    ])

    const passwordRules = ref([
        (val: string) => !!val || "Campo senha é obrigatório",
        (val: string) => (val && val.length >= 8) || "A senha deve conter no minímo 8 caracteres"
    ])

    return {
        nameRules,
        emailRules,
        passwordRules,
    }

}