import * as z from "zod";

export const schemaMovementCreditCard = z.object({
    id: z.number("ID da conta ausente").optional(),
    credit_card_id: z.number("Id do cartão de crédito ausente").min(1).nullish(),
    categorie_id: z.number("Id da categoria ausente").min(1),
    invoice_id: z.number("Id da fatura ausente").nullish(),
    description_credit: z.string("Descrição ausente").min(1),
    value_transaction: z.number("Valor menor ou igual a zero").min(0.01),
    purchase_date: z.string("Data da compra ausente"),
    installment_number: z.number().nullish(),
    installment_total: z.number().nullish(),
    recurrence_id: z.number().nullish(),
    observation: z.string().nullish(),
    status_movement: z.string().nullish(),
    closingDay: z.number().nullish(),
    invoice_month: z.number().nullish(),
    invoice_year: z.number().nullish(),
    refund_of_movement_id: z.number().nullish(),
    description_reversal: z.string().nullish(),
    type_recurrence : z.string().nullish(),
    status_invoice: z.string().nullish()
});

export type TMovementCreditCardPayload = z.infer<typeof schemaMovementCreditCard>