import * as z from "zod";

export const singIn = z.object({
    email: z.email("Formato do email inválido"),
    password: z.string("Campo senha vazio").min(6, "Mínimo 6 caracteres").max(32, "Máximo 32 caracteres")
})

export const singUp = z.object({
    name: z.string().max(55, "Máximo 55 caracteres").min(3, "Campo nome vazio"),
    email: z.email("Formato do email inválido"),
    password: z.string("Campo senha vazio").
    min(6, "Mínimo 6 caracteres)").
    regex(/[0-9]/, "Senha está faltando número").
    regex(/[^A-Za-z0-9]/, "Senha está faltando caractere especial").
    regex(/[A-Z]/, "Senha faltando letra maiuscula").
    regex(/[a-z]/, "Senha faltando letra minucula"),
    confirmPassword: z.string("Campo senha vazio").min(6, "Mínimo 6 caracteres")
}).superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "As senhas não coincidem",
            input: val,
            path: ["confirmPassword"]
        })
    }
})

export const passwordValidate = z.object({
    password: z.string("Campo senha vazio").
    min(6, "Mínimo 6 caracteres").
    regex(/[0-9]/, "Senha está faltando número").
    regex(/[^A-Za-z0-9]/, "Senha está faltando caractere especial").
    regex(/[A-Z]/, "Senha faltando letra maiuscula").
    regex(/[a-z]/, "Senha faltando letra minucula"),
    confirmPassword: z.string("Campo senha vazio").min(6, "Mínimo 6 caracteres")
}).superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "As senhas não coincidem",
            input: val,
            path: ["confirmPassword"]
        })
    }
})

export const emailValidate = z.object({
    email: z.email("Formato do email inválido") 
})

