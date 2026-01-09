import * as z from "zod";

export const schemaAccount = z.object({
    name: z.string().max(55, "Limite de caractere excedido").min(3, "Nome da conta é obrigatório"),
    type: z.string().min(3, "Nenhum tipo selecionado"),
    nameBank: z.string().min(3, "Nenhuma logo selecionada"),
    color: z.string().min(3, "Nenhuam cor selecionada"),
    urlImage: z.string().min(3, "Campo url vazio")
})