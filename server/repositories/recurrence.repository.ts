import client from "~/utils/db"
import { TRecurrencePayload } from "~~/schemas/recurrence.schema"
import { TMovementsPayload } from "~~/schemas/movements.schema"
import { TMovementCreditCardPayload } from "~~/schemas/movementCreditCard.schema"

export const recurrenceRepository = {

    async create(userId: string, data: TRecurrencePayload | null, dataMovements: TMovementsPayload[] | null) {

        const conn = await client.connect()

        try {
            await conn.query('BEGIN')

            const recurrenceResult = await conn.query(
                `INSERT INTO recurrence(user_id, value_recurrence, description_recurrence, accounts_id, categorie_id, type_recurrence, frequency_recurrence, total_installments, day_maturity, is_active) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
                RETURNING id`,
                [userId, data?.value_recurrence, data?.description_recurrence, data?.accounts_id, data?.categorie_id, data?.type_recurrence, data?.frequency_recurrence, data?.total_installments, data?.day_maturity, data?.is_active]
            )

            const recurrenceId = recurrenceResult.rows[0].id

            if (data?.type_recurrence === "fixa" && dataMovements) {
                for (const movement of dataMovements) {
                    await conn.query(
                        `INSERT INTO movements(user_id, type_transaction, value_transaction, date_transaction, description_transaction, categorie_id, accounts_id, observation, url_recibo, status_transaction, is_deleted, recurrence_id) 
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                        [userId, movement.type_transaction, movement.value_transaction, movement.date_transaction, movement.description_transaction, movement.categorie_id, movement.accounts_id, movement.observation, movement.url_recibo, movement.status_transaction, movement.is_deleted, recurrenceId]
                    )
                }
            }

            if (data?.type_recurrence === "parcelada" && dataMovements) {
                for (const [indice, valor] of dataMovements.entries()) {
                    await conn.query(
                        `INSERT INTO movements(user_id, type_transaction, value_transaction, date_transaction, description_transaction, categorie_id, accounts_id, observation, url_recibo, status_transaction, is_deleted, recurrence_id, installment_current) 
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                        [userId, valor.type_transaction, valor.value_transaction, valor.date_transaction, valor.description_transaction, valor.categorie_id, valor.accounts_id, valor.observation, valor.url_recibo, valor.status_transaction, valor.is_deleted, recurrenceId, indice + 1]
                    )
                }
            }

            await conn.query('COMMIT')

            return { message: "Recorrência criada com sucesso", status: 200, recurrenceId }

        } catch (error) {
            await conn.query('ROLLBACK')
            throw error
        } finally {
            conn.release()
        }
    },

    async createRecorrenceCreditCard(userId: string, data: TRecurrencePayload | null, dataMovementsCreditCard: TMovementCreditCardPayload[] | null) {

        const conn = await client.connect()

        try {
            await conn.query('BEGIN')

            const recurrenceResult = await conn.query(
                `INSERT INTO recurrence(user_id, value_recurrence, description_recurrence, accounts_id, categorie_id, type_recurrence, frequency_recurrence, total_installments, day_maturity, is_active) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
                RETURNING id`,
                [userId, data?.value_recurrence, data?.description_recurrence, data?.accounts_id, data?.categorie_id, data?.type_recurrence, data?.frequency_recurrence, data?.total_installments, data?.day_maturity, data?.is_active]
            )

            const recurrenceId = recurrenceResult.rows[0].id

            if (data?.type_recurrence === "fixa" && dataMovementsCreditCard) {

                for (const movement of dataMovementsCreditCard) {

                    const creditCardResult = await conn.query(
                    `SELECT closing_day
                    FROM credit_cards
                    WHERE id = $1
                    `,[movement.credit_cards_id]
                    )

                    if (creditCardResult.rows.length === 0) {
                        throw new Error("Cartão de crédito não encontrado")
                    }

                    const closingDayValue = creditCardResult.rows?.[0].closing_day

                    const creditCardId = movement.credit_cards_id
                    
                    const purchaseDateFormated = new Date(movement.purchase_date ?? Date.now())

                    if (closingDayValue === null) {
                        throw new Error(
                            `Dia de fechamento não informado para o cartão ${movement.credit_cards_id}`
                        )
                    }

                    const resultInvoice = calculateInvoiceMonth(purchaseDateFormated, closingDayValue)

                    const existingInvoice = await conn.query(
                        `SELECT id FROM credit_card_invoices WHERE credit_card_id = $1 AND invoice_month = $2 AND invoice_year = $3`,
                        [creditCardId, resultInvoice.month, resultInvoice.year]
                    )

                    let invoiceId: number

                    if (existingInvoice.rows.length > 0) {
                        invoiceId = existingInvoice.rows[0].id
                    } else {
                        const closingDate = new Date(resultInvoice.year, resultInvoice.month - 1, closingDayValue ?? 1)

                        const newInvoice = await conn.query(
                            `INSERT INTO credit_card_invoices(credit_card_id, invoice_month, invoice_year, status_invoice, closing_date, total_value)
                            VALUES($1, $2, $3, $4, $5, $6)
                            RETURNING id`,
                            [creditCardId, resultInvoice.month, resultInvoice.year, 'aberta', closingDate, 0]
                        )
                        
                        invoiceId = newInvoice.rows[0].id
                    }

                    await conn.query(
                        `INSERT INTO credit_card_movements(user_id, credit_card_id, invoice_id, categorie_id, description_credit, value_transaction, purchase_date, installment_number, recurrence_id, status_movement, observation) 
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                        [userId, movement.credit_cards_id, invoiceId, movement.categorie_id, movement.description_credit, movement.value_transaction, movement.purchase_date, null, recurrenceId, movement.status_movement, movement.observation]
                    )
                }
            }

            if (data?.type_recurrence === "parcelada" && dataMovementsCreditCard) {

                for (const [indice, valor] of dataMovementsCreditCard.entries()) {

                    const creditCardResult = await conn.query(
                    `SELECT closing_day
                    FROM credit_cards
                    WHERE id = $1
                    `,[valor.credit_cards_id]
                    )

                    if (creditCardResult.rows.length === 0) {
                        throw new Error("Cartão de crédito não encontrado")
                    }

                    const closingDayValue = creditCardResult.rows?.[0].closing_day

                    const creditCardId = valor.credit_cards_id
                    const purchaseDateFormated = new Date(valor.purchase_date)

                    const resultInvoice = calculateInvoiceMonth(purchaseDateFormated, closingDayValue ?? 0)

                    const existingInvoice = await conn.query(
                        `SELECT id FROM credit_card_invoices WHERE credit_card_id = $1 AND invoice_month = $2 AND invoice_year = $3`,
                        [creditCardId, resultInvoice.month, resultInvoice.year]
                    )

                    let invoiceId: number

                    if (existingInvoice.rows.length > 0) {
                        invoiceId = existingInvoice.rows[0].id
                    } else {
                        const closingDate = new Date(resultInvoice.year, resultInvoice.month - 1, closingDayValue ?? 1)

                        const newInvoice = await conn.query(
                            `INSERT INTO credit_card_invoices(credit_card_id, invoice_month, invoice_year, status_invoice, closing_date, total_value)
                            VALUES($1, $2, $3, $4, $5, $6)
                            RETURNING id`,
                            [creditCardId, resultInvoice.month, resultInvoice.year, 'aberta', closingDate, 0]
                        )
                        
                        invoiceId = newInvoice.rows[0].id
                    }

                    await conn.query(
                        `INSERT INTO credit_card_movements(user_id, credit_card_id, invoice_id, categorie_id, description_credit, value_transaction, purchase_date, installment_number, recurrence_id, status_movement, observation, installment_total) 
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                        [userId, valor.credit_cards_id, invoiceId, valor.categorie_id, valor.description_credit, valor.value_transaction, valor.purchase_date, indice + 1, recurrenceId, valor.status_movement, valor.observation, indice + 1]
                    )
                }
            }

            await conn.query('COMMIT')

            return { message: "Recorrência criada com sucesso", status: 200}

        } catch (error) {
            await conn.query('ROLLBACK')
            throw error
        } finally {
            conn.release()
        }
    },
}