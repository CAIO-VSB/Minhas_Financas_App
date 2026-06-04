import client from "~/utils/db"
import type { TTransfer } from "~~/types/transfer/TTransfer"

export const transferRepository = {
    
    async findAll(userId: string, month: number, year: number) {
        
        const text = 
        `SELECT * FROM fn_transfer($1, $2, $3) ORDER BY date_transfer ASC`

        const query = client.query(text, [userId, month, year])

        return (await query).rows
    },

    async create(userId: string, data: TTransfer) {

        await client.query('BEGIN')

        try {

            const transferResult = await client.query(`
                INSERT INTO transfer(user_id, value_transfer, date_transfer, account_origin, account_destination, observation, is_deleted) 
                VALUES($1, $2, $3, $4, $5, $6, $7) 
                RETURNING id`,
                [userId, data.value_transfer, data.date_transfer, data.account_origin, data.account_destination, data.observation ?? null, false]
            )

            const transferId = transferResult.rows[0].id

            await client.query(`
                INSERT INTO movements(user_id, type_transaction, value_transaction, date_transaction, description_transaction, categorie_id, accounts_id, observation, url_recibo, status_transaction, is_deleted, transfer_id) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [userId, 'transferencia_saida', data.value_transfer, data.date_transfer, 'Transferência de saída', 80, data.account_origin, null, null, 'saida', false, transferId]
            )

            await client.query(`
                INSERT INTO movements(user_id, type_transaction, value_transaction, date_transaction, description_transaction, categorie_id, accounts_id, observation, url_recibo, status_transaction, is_deleted, transfer_id) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [userId, 'transferencia_entrada', data.value_transfer, data.date_transfer, 'Transferência de entrada', 80, data.account_destination, null, null, 'entrada', false, transferId]
            )

            await client.query('COMMIT')

            return { message: "Transferência criada com sucesso", status: 200 }

        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        }

    }


}