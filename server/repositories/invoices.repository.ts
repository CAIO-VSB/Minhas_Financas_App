import client from "~/utils/db"

export const invoiceRepository = {

    async updateFullPayment(dataPayment: string, invoiceId: number, totalInvoice: number) {

        console.log("Caiu aqui??? Desgraçaaaaaaaaaaaaaaaaaaaaaaaa" + dataPayment, invoiceId, totalInvoice)

        const conn = await client.connect()  // fixa uma conexão dedicada

        try {
            
            await conn.query('BEGIN')

            await conn.query(`
                
                UPDATE credit_card_invoices 
                    SET date_payment = $1,
                        status_invoice = $2,
                        total_value = $3,
                        total_paid = $4
                    WHERE id = $5
            `, [dataPayment, 'fechada', totalInvoice, totalInvoice, invoiceId])


            await conn.query(`
            UPDATE movements 
                SET status_transaction = $1  
            WHERE movement_credit_card_id IN (
                SELECT id FROM credit_card_movements WHERE invoice_id = $2
            )
            `,['pago', invoiceId])
          
            await conn.query('COMMIT')

            return { message: "Fatura paga com sucesso" }

        } catch (error) {
            await conn.query('ROLLBACK')
            throw error
        } finally {
            conn.release()  
        }

    },

    async updatePaymentPartial(userId: string, dataPayment: string, accountsId: number, invoiceId: number, totalInvoice: number, totalPaid: number) {

        console.log("Bateu aqui " + dataPayment, accountsId, invoiceId, totalPaid)

        const conn = await client.connect()  // fixa uma conexão dedicada

        try {
            
            await conn.query('BEGIN')

            await conn.query(`
                
                UPDATE credit_card_invoices 
                    SET date_payment = $1,
                        status_invoice = $2,
                        total_value = $3,
                        total_paid = $4
                    WHERE id = $5
            `, [dataPayment, 'fechada', totalInvoice, totalPaid, invoiceId])

            await conn.query(`
            UPDATE movements 
                SET status_transaction = $1  
            WHERE movement_credit_card_id IN (
                SELECT id FROM credit_card_movements WHERE invoice_id = $2
            )
            `,['pago', invoiceId])

            const currentInvoice = await conn.query(`
                SELECT credit_card_id, invoice_month, invoice_year, closing_date FROM credit_card_invoices WHERE id = $1
            `, [invoiceId])

            const { credit_card_id, invoice_month, invoice_year } = currentInvoice.rows[0]
            const nextMonth = invoice_month === 12 ? 1 : invoice_month + 1
            const nextYear = invoice_month === 1 ? invoice_year + 1 : invoice_year

            const existingNextInvoice = await conn.query(
            `SELECT id FROM credit_card_invoices WHERE credit_card_id = $1 AND invoice_month = $2 AND invoice_year = $3`,
            [credit_card_id, nextMonth, nextYear]
            )

            let nextInvoiceId: number

            if (existingNextInvoice.rows.length > 0) {
                nextInvoiceId = existingNextInvoice.rows[0].id
            } else {
                const closingDay = new Date(currentInvoice.rows[0].closing_date).getDate()
                const nextClosingDate = new Date(nextYear, nextMonth - 1, closingDay)

                const newInvoice = await conn.query(
                    `INSERT INTO credit_card_invoices(credit_card_id, invoice_month, invoice_year, status_invoice, closing_date, total_value)
                    VALUES($1, $2, $3, $4, $5, $6)
                    RETURNING id`,
                    [credit_card_id, nextMonth, nextYear, 'aberta', nextClosingDate, null]
                )

                nextInvoiceId = newInvoice.rows[0].id
            }

            const remainingValue = totalInvoice - totalPaid

            const adjustmentMovement = await conn.query(`
                INSERT INTO credit_card_movements(user_id, credit_card_id, invoice_id, description_credit, value_transaction, purchase_date, status_movement, categorie_id)
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
                `
            , [userId, credit_card_id, nextInvoiceId, 'Saldo restante da fatura anterior', remainingValue, dataPayment, 'ativa', 5])

            const dateMovements = `${nextYear}-${nextMonth}-${dataPayment.split("-")[2]}`

            await conn.query(`
                INSERT INTO movements(user_id, type_transaction, value_transaction, date_transaction, description_transaction, categorie_id, accounts_id, observation, url_recibo, status_transaction, is_deleted, movement_credit_card_id)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `, [userId, 'saldo_anterior', remainingValue, dateMovements, 'Saldo restante da fatura anterior', 5, accountsId, null, null, 'pendente', false, adjustmentMovement.rows[0].id])

            await conn.query('COMMIT')

            return { message: "Fatura paga parcialmente com sucesso" }

        } catch (error) {
            await conn.query('ROLLBACK')
            throw error
        } finally {
            conn.release()  
        }

    }


}