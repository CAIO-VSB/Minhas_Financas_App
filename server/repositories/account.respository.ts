import client from "~/utils/db"

export const accountsRepository = {

    async findAll(userId: string, active?: boolean) {
        
        const text = active !== undefined
        ? `SELECT * FROM banks_accounts WHERE user_id = $1 AND active = $2 ORDER BY id ASC`
        : `SELECT * FROM banks_accounts WHERE user_id = $1 ORDER BY id ASC`

        const params = active !== undefined ? [userId, active === true] : [userId]

        const accounts = client.query(text, params)

        return (await accounts).rows 

    },

    async create(userId: string, data: {name_identifier: string, url_image: string, name_bank: string, type_account: string, active: boolean, color: string}) {

        const text = 
        `INSERT INTO banks_accounts(user_id, name_identifier, url_image, name_bank, type_account, active, color)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name_identifier, type_account, user_id, url_image`

        const values = [userId, data.name_identifier, data.url_image, data.name_bank, data.type_account, data.active, data.color]

        const account = client.query(text, values)

        return {message:"Conta criada com sucesso", status: 200, data: (await account).rows[0]}

    },

    async update(data: {name_identifier: string, url_image: string, name_bank: string, type_account: string, active: boolean, color: string, id?: number}) {

        const text = `
            UPDATE banks_accounts
            SET
                name_identifier = $1,
                url_image = $2,
                name_bank = $3,
                type_account = $4,
                color = $5,
                active = $6
            WHERE id = $7
            RETURNING *
        `

        const values = [data.name_identifier, data.url_image, data.name_bank, data.type_account, data.color, data.active, data.id]

        const newAccount = client.query(text, values)

        return (await newAccount).rows

    }


}