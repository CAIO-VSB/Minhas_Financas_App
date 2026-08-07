import client from "~/utils/db"
import { TRecurrencePayload } from "~~/schemas/recurrence.schema"
import { TMovementsPayload } from "~~/schemas/movements.schema"

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
}