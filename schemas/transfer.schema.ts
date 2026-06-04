import * as z from "zod";

export const schemaTransfer = z.object({
    id: z.number().optional(),
    user_id: z.string("Id do usuário ausente").min(3).optional(),
    value_transfer: z.number("Valor da transição ausente").min(1),
    date_transfer: z.string("Data ausente").min(3),
    account_destination: z.number("Conta origem faltando").min(1),
    account_origin: z.number("Conta destino faltando").min(1),
    observation: z.string("Observação faltando").optional()
})