import { auth } from "~/plugins/auth"
import client from "~/utils/db"
import { schemaCreditCard } from "~~/schemas/creditCard.schema"

export default defineEventHandler( async (event) => {

    const session = await auth.api.getSession({
        headers: event.headers
    })

    try {

        if (!session?.session.token) {
            throw createError({
                status: 401,
                message: "Token ausente"
            })
        }
            
        const result = await readValidatedBody(event, body => schemaCreditCard.safeParse(body))

        if (!result.success) {
            throw createError({
                status: 403,
                message: "Corpo da requisição inválida"
            })
        }

        const text = `INSERT INTO credit_cards(user_id, accounts_id, name_identifier, url_logo, due_day, closing_day, limit_card, active, four_digits) 

        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        
        RETURNING id, user_id, accounts_id, name_identifier, url_logo, due_day, closing_day, limit_card, active, four_digits`

        const values = [session.user.id, result.data.accounts_id, result.data.name_identifier, result.data.url_logo, result.data.due_day, result.data.closing_day, result.data.limit_card, result.data.active, result.data.four_digits]

        const categorie = client.query(text, values)

        return {message:"Cartão de crédito criado com sucesso", status: 200, data: (await categorie).rows[0]}

    } catch (error) {
        console.log("Erro ao criar cartao de credito" + error)
        throw createError({
            status: 500,
            message: "Erro ao criar categoria"
        })
    }

})