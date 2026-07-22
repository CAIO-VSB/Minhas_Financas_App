import * as z from "zod";

export const schemaTransfer = z.object({
    id: z.number().optional().nullish(),
    user_id: z.string("Id do usuário ausente").min(3).optional(),
    value_transfer: z.number("Valor da transição ausente").min(1),
    date_transfer:  z.string("Data inválida").regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido"),
    account_destination: z.number("Conta origem faltando").min(1).nullish(),
    account_origin: z.number("Conta destino faltando").min(1).nullish(),
    observation: z.string("Observação faltando").optional().nullish(),
    is_deleted: z.boolean().nullish(),
    logo_origem: z.string().optional(),
    logo_destino: z.string().optional(),
    account_origin_name: z.string().optional().nullish(),
    account_destination_name: z.string().optional().nullish()
})

export type TTransferPayload = z.infer<typeof schemaTransfer>