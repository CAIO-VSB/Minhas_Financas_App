import client from "~/utils/db"

export const movimentsRespository = {

    async create(userId: string, data: {id?: number, type_transaction: string, value_transaction: number, date_transaction: Date, description_transaction: string, categorie_id: number, accounts_id: number, observation?: string, url_recibo?: string, status_transaction: string, is_deleted?: boolean}) {

        const text = 
        `INSERT INTO movements(user_id, type_transaction, value_transaction, date_transaction, description_transaction, categorie_id, accounts_id, observation, url_recibo, status_transaction, is_deleted) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        RETURNING id, user_id, type_transaction, value_transaction, date_transaction, description_transaction, categorie_id, accounts_id, observation, url_recibo, status_transaction, is_deleted`

        const values = [userId, data.type_transaction, data.value_transaction, data.date_transaction, data.description_transaction, data.categorie_id, data.accounts_id, data.observation, data.url_recibo, data.status_transaction, data.is_deleted]

        const moviments = client.query(text, values)

        return {message:"Movimentação criada com sucesso", status: 200, data: (await moviments).rows[0]}

    },

}