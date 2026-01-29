import * as z from "zod";

export const schemaCategories = z.object({
    id: z.number("ID da conta está ausente").optional(),
    name_identifier: z.string().max(55, "Limite de caractere excedido").min(3, "Nome da conta é obrigatório"),
    type_categorie: z.string().min(3, "Nenhum tipo selecionado"),
    url_icon: z.string().min(3, "Campo url vazio"),
    active: z.boolean().default(true)
})