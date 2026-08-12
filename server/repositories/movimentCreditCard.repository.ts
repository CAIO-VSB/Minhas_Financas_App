import client from "~/utils/db"
import type { TMovementCreditCardPayload } from "~~/schemas/movementCreditCard.schema"
import calculateInvoiceMonth from "../utils/calculateInvoiceMonth"

export const movementsCreditCardRespository = {

    async create(userId: string, data: TMovementCreditCardPayload) {

        const conn = await client.connect()  // fixa uma conexão dedicada

        try {
            await conn.query('BEGIN')

            const purchaseDate = new Date(data.purchase_date)
            const resultInvoice = calculateInvoiceMonth(purchaseDate, data.closingDay ?? -1)

            const existingInvoice = await conn.query(
                `SELECT id FROM credit_card_invoices WHERE credit_card_id = $1 AND invoice_month = $2 AND invoice_year = $3`,
                [data.credit_cards_id, resultInvoice.month, resultInvoice.year]
            )

            let invoiceId: number

            if (existingInvoice.rows.length > 0) {
                invoiceId = existingInvoice.rows[0].id
            } else {
                const closingDate = new Date(resultInvoice.year, resultInvoice.month - 1, data.closingDay ?? 1)

                const newInvoice = await conn.query(
                    `INSERT INTO credit_card_invoices(credit_card_id, invoice_month, invoice_year, status_invoice, closing_date, total_value)
                    VALUES($1, $2, $3, $4, $5, $6)
                    RETURNING id`,
                    [data.credit_cards_id, resultInvoice.month, resultInvoice.year, 'aberta', closingDate, 0]
                )
                
                invoiceId = newInvoice.rows[0].id
            }

            const text = 
            `INSERT INTO credit_card_movements(user_id, credit_card_id, invoice_id, categorie_id, description_credit, value_transaction, purchase_date, installment_number, installment_total, recurrence_id, is_deleted, observation) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
            RETURNING *`

            const values = [userId, data.credit_cards_id, invoiceId, data.categorie_id, data.description_credit, data.value_transaction, data.purchase_date, null, null, null, data.is_deleted, data.observation]

            const movementsCreditCard = await conn.query(text, values)

            await conn.query('COMMIT')

            return { message: "Movimentação cartão de crédito criada com sucesso", status: 200, data: movementsCreditCard.rows[0] }

        } catch (error) {
            await conn.query('ROLLBACK')
            throw error
        } finally {
            conn.release()  // devolve a conexão pro pool, sempre, com ou sem erro
        }
    },

    async findByCreditCard(userId: string, month: number, year: number, creditCardId: number) {

        console.log("Ta chamando aqui pelo menos " + userId, month, year, creditCardId)

        const invoiceResult = await client.query(
            `SELECT id FROM credit_card_invoices WHERE credit_card_id = $1 AND invoice_month = $2 AND invoice_year = $3`,
            [creditCardId, month, year]
        )

        const invoiceId = invoiceResult.rows?.[0]?.id ?? null

        const text = 
        `SELECT * FROM fn_credit_card_movements($1, $2, $3) ORDER BY purchase_date ASC`

        const query = client.query(text, [userId, creditCardId, invoiceId])

        return (await query).rows
    },
    
    async findTotalInvoice(userId: string, month: number, year: number, creditCardId: number) {

        const invoiceResult = await client.query(`SELECT id FROM credit_card_invoices WHERE credit_card_id = $1 AND invoice_month = $2 AND invoice_year = $3 `, [creditCardId, month, year])

        if (invoiceResult.rows.length === 0) {
            return {total: 0}
        }

        const invoiceId = invoiceResult.rows[0].id
        
        const text = 
        `SELECT * FROM fn_credit_card_invoice_total($1, $2, $3, $4, $5)`

        const query = await client.query(text, [userId, month, year, creditCardId, invoiceId])

        return { total: Number(query.rows[0]?.fn_credit_card_invoice_total ?? 0) }
    },
    
}