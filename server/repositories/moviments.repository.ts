import client from "~/utils/db"

export const movementsRespository = {

    async create(userId: string, data: {id?: number, type_transaction: string, value_transaction: number, date_transaction: Date, description_transaction: string, categorie_id: number, accounts_id: number, observation?: string, url_recibo?: string, status_transaction: string, is_deleted?: boolean}) {

        const text = 
        `INSERT INTO movements(user_id, type_transaction, value_transaction, date_transaction, description_transaction, categorie_id, accounts_id, observation, url_recibo, status_transaction, is_deleted) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        RETURNING id, user_id, type_transaction, value_transaction, date_transaction, description_transaction, categorie_id, accounts_id, observation, url_recibo, status_transaction, is_deleted`

        const values = [userId, data.type_transaction, data.value_transaction, data.date_transaction, data.description_transaction, data.categorie_id, data.accounts_id, data.observation, data.url_recibo, data.status_transaction, data.is_deleted]

        const moviments = client.query(text, values)

        return {message:"Movimentação criada com sucesso", status: 200, data: (await moviments).rows[0]}

    },

    async findAll(userId: string, month: number, year: number) {

        const text = 
        `SELECT * FROM fn_movements($1, $2, $3) ORDER BY date_transaction ASC`

        const movements = client.query(text, [userId, month, year])

        return (await movements).rows
    },

    async findOnlyRevenues(userId: string, month: number, year: number) {
        
        const text =
        `SELECT * FROM fn_movements_only_revenues($1, $2, $3) ORDER BY date_transaction ASC`

        const movementsOnlyRevenues = client.query(text, [userId, month, year])

        return (await movementsOnlyRevenues).rows
    },

    async findOnlyExpenses(userId: string, month: number, year: number) {
        
        const text =
        `SELECT * FROM fn_movements_only_expenses($1, $2, $3) ORDER BY date_transaction ASC`

        const movementsOnlyExpenses = client.query(text, [userId, month, year])

        return (await movementsOnlyExpenses).rows
    },

    async findCurrentBalance(userId: string) {
        
        const text =
        `SELECT fn_current_balance($1) AS saldo_atual`

        const currentBalance = client.query(text, [userId])

        return (await currentBalance).rows
    },

    async findMovementsByFilter(userId: string, start_day: string, end_day: string, categorie_id: number[], accounts_id: number[], situation: string, for_type: string[]) {

        console.log("Valores recebidos no backEnd", userId, start_day, end_day, categorie_id, accounts_id, situation, for_type)

        const categorieParam = categorie_id.length > 0 ? categorie_id : null
        const accountsParam = accounts_id.length > 0 ? accounts_id : null
        let situationParam = situation || null
        let forTypeParam = for_type.length > 0 ? for_type : null
        const startParam = start_day || null
        const endParam = end_day || null

        if (situationParam === "Recebidas") {
            situationParam = "recebido"
        } else if (situationParam === "Pagas") {
            situationParam = "pago"
        } else if (situationParam === "Pendentes") {
            situationParam = "pendente"
        }

        if (forTypeParam) {
            forTypeParam = forTypeParam.map(type => {
                if (type === 'Receitas') return 'Receita'
                if (type === 'Despesas') return 'Despesa'
                return type
            })
        }

        const text =
        `SELECT * FROM fn_movements_filter($1, $2, $3, $4, $5, $6, $7) ORDER BY date_transaction ASC`

        const movementsByFilter = client.query(text, [userId, startParam, endParam, categorieParam, accountsParam, situationParam, forTypeParam])

        return (await movementsByFilter).rows
    },

    async update(data: {id?: number, type_transaction?: string, value_transaction: number, date_transaction: Date, description_transaction: string, categorie_id: number, accounts_id: number, observation?: string, url_recibo?: string, status_transaction: string, is_deleted?: boolean}) {

        const text = 
        `UPDATE movements 
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
            WHERE id = $11
        `
        const values = [data.type_transaction, data.value_transaction, data.date_transaction, data.description_transaction, data.categorie_id, data.accounts_id, data.observation, data.url_recibo, data.status_transaction, data.is_deleted, data.id]

        const updateMovements = client.query(text, values)

        return (await updateMovements).rows
    }       

}