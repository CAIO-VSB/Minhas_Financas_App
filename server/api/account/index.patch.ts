import { schemaAccount } from "~~/schemas/account.schema"
import { auth } from "~~/auth"
import client from "~/utils/db"

export default defineEventHandler( async (event) => {

    const session = await auth.api.getSession({
        headers: event.headers
    })

    if (!session?.session.token) {
        throw createError({
            status: 401,
            statusMessage: "Unauthorized"
        })
    }
        
    const result = await readValidatedBody(event, body => schemaAccount.safeParse(body))

    if (!result.success) {
        throw createError({
            status: 422,
            statusMessage: "Unprocessable Entity"
        })
    }

    const text = `
    UPDATE banks_accounts
    SET
        name_identifier = $1,
        url_image = $2,
        name_bank = $3,
        type_account = $4,
        color = $5,
        active = $6,
        update_at = NOW()
    WHERE id = $7
    RETURNING *
    `

    const values = [result.data.name_identifier, result.data.url_image, result.data.name_bank, result.data.type_account, result.data.color, result.data.active, result.data.id]


    try {

        const newAccount = client.query(text, values)

        return (await newAccount).rows

    } catch (error) {
        
        console.log("Erro ao modificar conta", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})