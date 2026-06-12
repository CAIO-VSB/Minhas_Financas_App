import client from "~/utils/db"
import type { TTransfer } from "~~/types/transfer/TTransfer"

export const transferRepository = {
    
    async findAll(userId: string, month: number, year: number) {
        
        const text = 
        `SELECT * FROM fn_transfer($1, $2, $3) ORDER BY date_transfer ASC`

        const query = client.query(text, [userId, month, year])

        return (await query).rows
    },

    async findById(id: number) {


        const text =
        `SELECT * FROM transfer WHERE id = $1`

        const query = client.query(text, [id])

        return (await query).rows[0]
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

    },

    async update(id: number, data: TTransfer) {

        console.log("valor" + id, data)
        
        await client.query('BEGIN')

        try {

            await client.query(`
                UPDATE transfer 
                    SET value_transfer = $1,
                        date_transfer = $2,
                        account_origin = $3,
                        account_destination = $4,
                        observation = $5,
                        is_deleted= $6
                    WHERE id = $7
                `,
                [data.value_transfer, data.date_transfer, data.account_origin, data.account_destination, data.observation ?? null, false, id]
            )

            await client.query(`
                UPDATE movements 
                    SET 
                        type_transaction = $1,
                        value_transaction = $2,
                        date_transaction = $3,
                        description_transaction = $4,
                        categorie_id = $5,
                        accounts_id = $6,
                        observation = $7,
                        url_recibo = $8,
                        status_transaction = $9,
                        is_deleted = $10
                    WHERE transfer_id = $11 AND type_transaction = $12`,
                ['transferencia_saida', data.value_transfer, data.date_transfer, 'Transferência de saída', 80, data.account_origin, null, null, 'saida', false, id,'transferencia_saida']
            )

            await client.query(`
                UPDATE movements 
                    SET 
                        type_transaction = $1,
                        value_transaction = $2,
                        date_transaction = $3,
                        description_transaction = $4,
                        categorie_id = $5,
                        accounts_id = $6,
                        observation = $7,
                        url_recibo = $8,
                        status_transaction = $9,
                        is_deleted = $10
                    WHERE transfer_id = $11 AND type_transaction = $12
                `,
                ['transferencia_entrada', data.value_transfer, data.date_transfer, 'Transferência de entrada', 80, data.account_destination, null, null, 'entrada', false, id, 'transferencia_entrada']
            )

            await client.query('COMMIT')

            return { message: "Transferência editada com sucesso", status: 200 }

        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        }

    },

    async updateSoftDelete(id: number, isDeleted: boolean) {

        console.log("valor" + id, isDeleted)

        const deleteValue = isDeleted ?? false
        
        await client.query('BEGIN')

        try {

            await client.query(`
                UPDATE transfer 
                    SET 
                        is_deleted= $1
                    WHERE id = $2
                `,
                [deleteValue, id]
            )

            await client.query(`
                UPDATE movements 
                    SET 
                        is_deleted = $1
                    WHERE transfer_id = $2 AND type_transaction IN ($3, $4)`,
                [ deleteValue, id, 'transferencia_entrada', 'transferencia_saida']
            )

            await client.query('COMMIT')

            return { message: "Transferência editada com sucesso", status: 200 }

        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        }

    }


}