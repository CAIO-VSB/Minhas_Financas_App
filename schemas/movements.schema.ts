import * as z from "zod";

export const schemaMovements = z.object({
    id: z.number().optional(),
    type_transaction: z.string("Tipo de transaçao ausente").min(1),
    value_transaction: z.number("Valor da transição ausente").min(1),
    date_transaction: z.coerce.date(),
    description_transaction: z.string("Descrição da transação ausente").min(1),
    categorie_id: z.number("Categoria ausente").min(1),
    accounts_id: z.number("Conta ausente").min(1),
    observation: z.string().optional().nullable(),
    url_recibo: z.string().optional(),
    status_transaction: z.string("Status ausente").min(1),
    is_deleted: z.boolean().default(false).optional(),
})