import * as z from "zod";

export const schemaGoals = z.object({
    id: z.number("ID da conta ausente").optional(),
    name_identifier: z.string().max(60, "Limite de caractere excedido").min(1, "Nome da conta é obrigatório"),
    suggested_value: z.number().optional(),
    goal_value: z.number("Valor total da meta ausente").min(0.1).optional(),
    start_date: z.string("Data de inicio ausente"),
    end_date: z.string("Data de inicio ausente"),
    active: z.boolean().default(true)
});

export const schemaGoalsArchive = z.object({
    active: z.boolean()
})

export type TGoalsPayload = z.infer<typeof schemaGoals>

