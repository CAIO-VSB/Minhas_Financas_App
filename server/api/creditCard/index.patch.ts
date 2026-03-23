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
            four_digits = $8,
            update_at = NOW()
        WHERE id = $9
        RETURNING *
        `

        const values = [result.data.accounts_id, result.data.name_identifier, result.data.url_logo, result.data.due_day, result.data.closing_day, result.data.limit_card, result.data.active, result.data.four_digits, result.data.id]

        const newCategorie = client.query(text, values)

        return (await newCategorie).rows

    } catch (error) {
        console.log("Erro ao modificar cartão de crédito ", error)
        throw createError({
            status: 500,
            statusMessage: `Erro ao editar ${error}`
        })
    }

})