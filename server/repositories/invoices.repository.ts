import client from "~/utils/db"

export const invoiceRepository = {

    async updateFullPayment(userId: string, dataPayment: string, totalInvoice: number, accountsId: number,  invoiceId: number) {

        const conn = await client.connect()  // fixa uma conexão dedicada

        try {
            
            await conn.query('BEGIN')

            await conn.query(`
                
                UPDATE credit_card_invoices 
                    SET date_payment = $1,
                        status_invoice = $2,
                        total_value = $3,
                        total_paid = $4,
                        accounts_id = $5
                    WHERE id = $6
            `, [dataPayment, 'fechada', totalInvoice, totalInvoice, accountsId, invoiceId])

            await conn.query(
                `INSERT INTO movements(user_id, type_transaction, value_transaction, date_transaction, description_transaction, categorie_id, accounts_id, observation, url_recibo, status_transaction, is_deleted, invoice_id) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
                RETURNING id`,
                [userId, 'pagamento_fatura', totalInvoice, dataPayment, 'Pagamento da fatura', 6, accountsId, 'Pagamento da fatura', null, 'pago', false, invoiceId]
            )
          
            await conn.query('COMMIT')

            return { message: "Fatura paga com sucesso" }

        } catch (error) {
            await conn.query('ROLLBACK')
            throw error
        } finally {
            conn.release()  
        }

    },

    async updatePaymentPartial(userId: string, dataPayment: string, totalInvoice: number, totalPaid: number, accountsId: number, invoiceId: number) {

        console.log("Chgeando aqui os valroes " + userId, dataPayment, totalInvoice, accountsId, invoiceId)

        const conn = await client.connect()  // fixa uma conexão dedicada

        try {
            
            await conn.query('BEGIN')

            await conn.query(`
                
                UPDATE credit_card_invoices 
                    SET date_payment = $1,
                        status_invoice = $2,
                        total_value = $3,
                        total_paid = $4,
                        accounts_id = $5
                    WHERE id = $6
            `, [dataPayment, 'fechada', totalInvoice, totalPaid, accountsId, invoiceId])

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

            await conn.query(`
                INSERT INTO credit_card_movements(user_id, credit_card_id, invoice_id, description_credit, value_transaction, purchase_date, status_movement, categorie_id)
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
                `
            , [userId, credit_card_id, invoiceId, 'Pagamento parcial*', totalPaid, dataPayment, 'parcial', 8])

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

            await conn.query(`
                INSERT INTO credit_card_movements(user_id, credit_card_id, invoice_id, description_credit, value_transaction, purchase_date, status_movement, categorie_id)
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
                `
            , [userId, credit_card_id, nextInvoiceId, 'Saldo restante da fatura anterior', remainingValue, dataPayment, 'ativa', 5])

            await conn.query('COMMIT')

            return { message: "Fatura paga parcialmente com sucesso" }

        } catch (error) {
            await conn.query('ROLLBACK')
            throw error
        } finally {
            conn.release()  
        }

    },

    async updatePaymentAdvance(userId: string, dataPayment: string, accountsId: number, invoiceId: number, totalInvoice: number, totalPaid: number, invoice_month: number, invoice_year: number, creditCardId: number, closingDay: number) {

        const conn = await client.connect()  // fixa uma conexão dedicada

        try {

            const invoiceMonth = invoice_month
            const invoiceYear = invoice_year
            
            await conn.query('BEGIN')

            const existingNextInvoice = await conn.query(
            `SELECT id FROM credit_card_invoices WHERE credit_card_id = $1 AND invoice_month = $2 AND invoice_year = $3`,
            [creditCardId, invoiceMonth, invoiceYear]
            )

            let nextInvoiceId: number

            if (existingNextInvoice.rows.length > 0) {
                nextInvoiceId = existingNextInvoice.rows[0].id
            } else {
                const closingDate = new Date(invoiceYear, invoiceMonth - 1, closingDay ?? undefined)

                const newInvoice = await conn.query(
                    `INSERT INTO credit_card_invoices(credit_card_id, invoice_month, invoice_year, status_invoice, closing_date, total_value)
                    VALUES($1, $2, $3, $4, $5, $6)
                    RETURNING id`,
                    [creditCardId, invoiceMonth, invoiceYear, 'aberta', closingDate, null]
                )

                nextInvoiceId = newInvoice.rows[0].id
            }

            await conn.query(`
                INSERT INTO credit_card_movements(user_id, credit_card_id, invoice_id, description_credit, value_transaction, purchase_date, status_movement, categorie_id)
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
                `
            , [userId, creditCardId, nextInvoiceId, 'Pagamento adiantado*', totalPaid, dataPayment, 'adiantado', 7])

            await conn.query('COMMIT')

            return { message: "Fatura paga adiantada com sucesso" }

        } catch (error) {
            await conn.query('ROLLBACK')
            throw error
        } finally {
            conn.release()  
        }

    }


}