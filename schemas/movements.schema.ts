import * as z from "zod";

export const schemaMovements = z.object({
    id: z.number().optional(),
    type_transaction: z.string("Tipo de transaçao ausente").min(1),
    value_transaction: z.number("Valor da transição ausente").min(0.01).nullish(),
    date_transaction: z.string("Data inválida").regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido"),
    description_transaction: z.string("Descrição da transação ausente").min(1),
    categorie_id: z.number("Categoria ausente").min(1).nullish(),
    accounts_id: z.number("Conta ausente").min(1).nullish(),
    observation: z.string().nullish(),
    url_recibo: z.string().nullish(),
    status_transaction: z.string("Status ausente").min(1),
    is_deleted: z.boolean().default(false).optional(),
})

export type TMovementsPayload = z.infer<typeof schemaMovements>