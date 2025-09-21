import * as z from "zod";

export const singIn = z.object({
    email: z.email("Formato do email inválido"),
    password: z.string("Campo senha vazio").min(8, "Mínimo 8 caracteres").max(32, "Máximo 32 caracteres")
})

export const singUp = z.object({
    name: z.string("Campo nome vazio").max(55, "Máximo 55 caracteres"),
    email: z.email("Formato do email inválido"),
    password: z.string("Campo senha vazio").
    min(8, "Mínimo 8 caracteres)").
    regex(/[A-Z]/, "Senha está faltando letra Maiúscula").
    regex(/[a-z]/, "Senha está Faltando letra minúscula").
    regex(/[0-9]/, "Senha está faltando número").
    regex(/[^A-Za-z0-9]/, "Senha está faltando caractere especial"),
    confirmPassword: z.string("Campo senha vazio").min(8, "Mínimo 8 caracteres")
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

