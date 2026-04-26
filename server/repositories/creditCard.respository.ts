import client from "~/utils/db"

export const creditCardRespository = {

    async findAll(userId: string, active?: boolean) {

        const text = active !== undefined
        ? `SELECT * FROM credit_cards WHERE user_id = $1 AND active = $2 ORDER BY id ASC`
        : `SELECT * FROM credit_cards WHERE user_id = $1 ORDER BY id ASC`

        const params = active !== undefined
        ? [userId, active === true]
        : [userId]

        const accounts = client.query(text, params)

        return (await accounts).rows 

    },

    async create(userId: string, data: { accounts_id: number, name_identifier: string, url_logo: string, due_day: number, closing_day: number, limit_card: number, active: boolean, four_digits: string}) {

        const text = 
        `INSERT INTO credit_cards(user_id, accounts_id, name_identifier, url_logo, due_day, closing_day, limit_card, active, four_digits) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING id, user_id, accounts_id, name_identifier, url_logo, due_day, closing_day, limit_card, active, four_digits`

        const values = [userId, data.accounts_id, data.name_identifier, data.url_logo, data.due_day, data.closing_day, data.limit_card, data.active, data.four_digits]

        
        const categorie = client.query(text, values)

        return {message:"Cartão de crédito criado com sucesso", status: 200, data: (await categorie).rows[0]}

    },

    async update(data: {accounts_id: number, name_identifier: string, url_logo: string, due_day: number, closing_day: number, limit_card: number, active: boolean, four_digits: string, id?: number}) {

        const text = `
        UPDATE credit_cards
        SET
            accounts_id = $1,
            name_identifier = $2,
            url_logo = $3,
            due_day = $4,
            closing_day = $5,
            limit_card = $6,
            active = $7,
            four_digits = $8
        WHERE id = $9
        RETURNING *
        `
        const values = [data.accounts_id, data.name_identifier, data.url_logo, data.due_day, data.closing_day, data.limit_card, data.active, data.four_digits, data.id]

        const newCategorie = client.query(text, values)

        return (await newCategorie).rows

    } 

}