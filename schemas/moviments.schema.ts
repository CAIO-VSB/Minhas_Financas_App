import * as z from "zod";

export const schemaMoviments = z.object({
    id: z.number().optional(),
    value_transaction: z.number("Valor da transição ausente").min(1),
    date_transaction: z.coerce.date(),
    description_transaction: z.string("Descrição da transação ausente").min(3),
    categorie_id: z.number("Categoria ausente").min(1),
    accounts_id: z.number("Conta ausente").min(1),
    observation: z.string("Campo observação ausente").min(3).optional(),
    url_recibo: z.string("Campo comprovante ausente").min(3).optional(),
    status_transaction: z.string("Status ausente").min(3),
    is_deleted: z.boolean().default(false).optional()
})