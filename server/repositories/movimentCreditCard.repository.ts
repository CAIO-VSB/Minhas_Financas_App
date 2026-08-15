import client from "~/utils/db"
import type { TMovementCreditCardPayload } from "~~/schemas/movementCreditCard.schema"

export const movementsCreditCardRespository = {

    async create(userId: string, data: TMovementCreditCardPayload) {

        const conn = await client.connect()  // fixa uma conexão dedicada

        try {
            await conn.query('BEGIN')

            //const purchaseDate = new Date(data.purchase_date)
            //const resultInvoice = calculateInvoiceMonth(purchaseDate, data.closingDay ?? 0)

            const invoiceMonth = data.invoice_month
            const invoiceYear = data.invoice_year

            const existingInvoice = await conn.query(
                `SELECT id FROM credit_card_invoices WHERE credit_card_id = $1 AND invoice_month = $2 AND invoice_year = $3`,
                [data.credit_card_id, invoiceMonth, invoiceYear]
            )

            let invoiceId: number

            if (existingInvoice.rows.length > 0) {
                invoiceId = existingInvoice.rows[0].id
            } else {

                if (!invoiceMonth || !invoiceYear) {
                    throw new Error("Mês ou ano da fatura ausentes")
                }

                const closingDate = new Date(invoiceYear, invoiceMonth - 1, data.closingDay ?? 1)

                const newInvoice = await conn.query(
                    `INSERT INTO credit_card_invoices(credit_card_id, invoice_month, invoice_year, status_invoice, closing_date, total_value)
                    VALUES($1, $2, $3, $4, $5, $6)
                    RETURNING id`,
                    [data.credit_card_id, invoiceMonth, invoiceYear, 'aberta', closingDate, 0]
                )
                
                invoiceId = newInvoice.rows[0].id
            }

            const text = 
            `INSERT INTO credit_card_movements(user_id, credit_card_id, invoice_id, categorie_id, description_credit, value_transaction, purchase_date, installment_number, installment_total, recurrence_id, status_movement, observation) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
            RETURNING *`

            const values = [userId, data.credit_card_id, invoiceId, data.categorie_id, data.description_credit, data.value_transaction, data.purchase_date, null, null, null, data.status_movement, data.observation]

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

    async update(id: number, userId: string, data: TMovementCreditCardPayload) {

        console.log("Bateu aqui " + id, userId, JSON.stringify(data))

        const conn = await client.connect()  // fixa uma conexão dedicada

        try {
            
            await conn.query('BEGIN')
            //const purchaseDate = new Date(data.purchase_date)
            //const resultInvoice = calculateInvoiceMonth(purchaseDate, data.closingDay ?? 0)

            const invoiceMonth = data.invoice_month
            const invoiceYear = data.invoice_year

            const existingInvoice = await conn.query(
                `SELECT id FROM credit_card_invoices WHERE credit_card_id = $1 AND invoice_month = $2 AND invoice_year = $3`,
                [data.credit_card_id, invoiceMonth, invoiceYear]
            )

            let invoiceId: number

            if (existingInvoice.rows.length > 0) {

                invoiceId = existingInvoice.rows[0].id

            } else {

                if (!invoiceMonth || !invoiceYear) {
                    throw new Error("Mês ou ano da fatura ausentes")
                }
    
                const closingDate = new Date(invoiceYear, invoiceMonth - 1, data.closingDay ?? 1)

                const newInvoice = await conn.query(
                    `INSERT INTO credit_card_invoices(credit_card_id, invoice_month, invoice_year, status_invoice, closing_date, total_value)
                    VALUES($1, $2, $3, $4, $5, $6)
                    RETURNING id`,
                    [data.credit_card_id, invoiceMonth, invoiceYear, 'aberta', closingDate, null]
                )
                
                invoiceId = newInvoice.rows[0].id
            }

            await conn.query(
            `UPDATE credit_card_movements
                SET 
                    credit_card_id = $1,
                    categorie_id = $2,
                    description_credit = $3,
                    value_transaction = $4,
                    purchase_date = $5,
                    observation = $6,
                    invoice_id = $7
                WHERE id = $8 AND user_id = $9
                `, [data.credit_card_id, data.categorie_id, data.description_credit, data.value_transaction, data.purchase_date, data.observation, invoiceId, id, userId])

            await conn.query('COMMIT')

            return { message: "Movimentação editada com sucesso"}
        } catch (error) {
            await conn.query('ROLLBACK')
            throw error
        } finally {
            conn.release()  
        }

    }


}