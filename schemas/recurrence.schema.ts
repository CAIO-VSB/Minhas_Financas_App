import * as z from "zod";

export const schemaRecurrence = z.object({
    id: z.number().optional(),
    value_recurrence: z.number("Valor da recorrênca vazio").min(1),
    description_recurrence: z.string("Descrição vazia").min(1),
    categorie_id: z.number("Categoria vazia").min(1),
    accounts_id: z.number("Conta bancária vazia").min(1),
    type_recurrence: z.string("Tipo da recorrência vazia").min(1),
    frequency_recurrence: z.string().nullish().optional(),
    total_installments: z.number().nullish().optional(),
    day_maturity: z.string("Data inválida").regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido"),
    is_active: z.boolean().default(false).optional()
})


export type TRecurrencePayload = z.infer<typeof schemaRecurrence>