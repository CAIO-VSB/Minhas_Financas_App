import client from "~/utils/db"

export const accountsRepository = {

    async findAll(userId: string, active?: boolean) {
        
        const text = active !== undefined
        ? `SELECT a.*, COALESCE(v.saldo_atual, 0) AS saldo_atual
            FROM banks_accounts a
            LEFT JOIN vw_balance_for_account v ON v.accounts_id = a.id
            WHERE user_id = $1 AND active = $2  
            ORDER BY id ASC`

        : `SELECT a.*, COALESCE(v.saldo_atual, 0) AS saldo_atual
			FROM banks_accounts a
			LEFT JOIN vw_balance_for_account v ON v.accounts_id = a.id
			WHERE a.user_id = $1  ORDER BY id ASC`

        const params = active !== undefined ? [userId, active === true] : [userId]

        const accounts = client.query(text, params)

        return (await accounts).rows 

    },

    
    async findBalanceForAccount(userId: string) {
        
        const text = `
            SELECT a.*, COALESCE(v.saldo_atual, 0) AS saldo_atual
			FROM banks_accounts a
			LEFT JOIN vw_balance_for_account v ON v.accounts_id = a.id
			WHERE a.user_id = $1 
        `

        const values = [userId]

        const accountsBalance = client.query(text, values)

        return (await accountsBalance).rows 

    },

    async create(userId: string, data: {id?: number, name_identifier: string, url_image: string, name_bank: string, type_account: string, active: boolean, color: string, initial_balance?: number}) {

        const text = 
        `INSERT INTO banks_accounts(user_id, name_identifier, url_image, name_bank, type_account, active, color)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name_identifier, type_account, user_id, url_image`

        const values = [userId, data.name_identifier, data.url_image, data.name_bank, data.type_account, data.active, data.color]

        const account = client.query(text, values)

        const accountsId = (await account).rows[0].id

        if (data.initial_balance && data.initial_balance > 0) {
            const textMovements = 
            `INSERT INTO movements(user_id, type_transaction, value_transaction, date_transaction, description_transaction, categorie_id, accounts_id, observation, url_recibo, status_transaction, is_deleted) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING id, user_id, type_transaction, value_transaction, date_transaction, description_transaction, categorie_id, accounts_id, observation, url_recibo, status_transaction, is_deleted`

            const valuesMovements = [userId, 'Saldo inicial', data.initial_balance, new Date(), 'Saldo inicial', null, accountsId, null, null, 'Saldo inicial', false]

            const movements = client.query(textMovements, valuesMovements)

            return (await movements).rows
        }

        return {message:"Conta criada com sucesso", status: 200, data: (await account).rows[0]}

    },

    async update(userId: string, data: {name_identifier: string, url_image: string, name_bank: string, type_account: string, active: boolean, color: string, id?: number, initial_balance?: number}) {

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

        const values = [data.name_identifier, data.url_image, data.name_bank, data.type_account, data.color, data.active,  data.id]

        const updateAccount = client.query(text, values)

        const accountsId = (await updateAccount).rows[0].id

        if (data.initial_balance !== undefined) {

            //Deleto o valor antigo para setar o novo, caso contrário, ficaria duas transações no banco
            const text = 
            `DELETE FROM movements WHERE accounts_id = $1 AND type_transaction = 'Saldo inicial'`

            await client.query(text, [accountsId])

            const textMovements = 
            `INSERT INTO movements(user_id, type_transaction, value_transaction, date_transaction, description_transaction, categorie_id, accounts_id, observation, url_recibo, status_transaction, is_deleted) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING id, user_id, type_transaction, value_transaction, date_transaction, description_transaction, categorie_id, accounts_id, observation, url_recibo, status_transaction, is_deleted`

            const valuesMovements = [userId, 'Saldo inicial', data.initial_balance, new Date(), 'Saldo inicial', null, accountsId, null, null, 'Saldo inicial', false]

            await client.query(textMovements, valuesMovements)

            return { message: "Conta editada com sucesso", status: 200, data: (await updateAccount).rows[0] }

        }


    }


}