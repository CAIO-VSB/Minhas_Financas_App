import client from "~/utils/db"
import { type TGoalsPayload } from "~~/schemas/goals.schema"

export const goalsRepository = {

    async create(userId: string, data: TGoalsPayload) {

        const conn = await client.connect() 

        try {
            
            await conn.query('BEGIN')

            await conn.query(`
                INSERT INTO goals(user_id, name_identifier, suggested_value, goal_value, start_date, end_date, accounts_id, active) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
                RETURNING id`,[userId, data.name_identifier, data.suggested_value, data.goal_value, data.start_date, data.end_date, data.accounts_id, data.active]
            )

            await conn.query('COMMIT')

            return { message: "Economia criada com sucesso" }

        } catch (error) {
            await conn.query('ROLLBACK')
            throw error
        } finally {
            conn.release()  
        }

    },

    async findAll(userId: string) {

        const conn = await client.connect() 

        try {
            
            await conn.query('BEGIN')

            const result = await conn.query(`
                SELECT * FROM goals WHERE user_id = $1
            `,[userId]
            )

            await conn.query('COMMIT')

            return result.rows

        } catch (error) {
            await conn.query('ROLLBACK')
            throw error
        } finally {
            conn.release()  
        }

    },

    async update(userId: string, id: number, data: TGoalsPayload) {

        const conn = await client.connect() 

        try {
            
            await conn.query(`
                UPDATE goals
                    SET name_identifier = $1,
                        suggested_value = $2,
                        goal_value = $3,
                        start_date = $4,
                        end_date = $5,
                        accounts_id = $6,
                    WHERE id = $7 AND user_id = $8
                `,[data.name_identifier, data.suggested_value, data.goal_value, data.start_date, data.end_date, data.accounts_id, id, userId]
            )

            await conn.query('COMMIT')

            return { message: "Economia atualizada com sucesso" }

        } catch (error) {
            await conn.query('ROLLBACK')
            throw error
        } finally {
            conn.release()  
        }

    },

    async archive(userId: string, id: number, active: boolean) {

        const conn = await client.connect() 

        try {
            
            await conn.query(`
                UPDATE goals SET active = $1 WHERE id = $2 AND user_id = $3`,[active, id, userId]
            )

            await conn.query('COMMIT')

            return { message: "Economia atualizada com sucesso" }

        } catch (error) {
            await conn.query('ROLLBACK')
            throw error
        } finally {
            conn.release()  
        }

    }
}