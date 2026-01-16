import * as z from "zod";

export const schemaAccount = z.object({
    id: z.number("ID da conta está ausente").optional(),
    name_identifier: z.string().max(55, "Limite de caractere excedido").min(3, "Nome da conta é obrigatório"),
    type_account: z.string().min(3, "Nenhum tipo selecionado"),
    name_bank: z.string().min(3, "Nenhuma logo selecionada"),
    color: z.string().min(3, "Nenhuam cor selecionada"),
    url_image: z.string().min(3, "Campo url vazio"),
    active: z.boolean().default(true)
})