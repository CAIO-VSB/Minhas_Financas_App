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

    const text = 
    `INSERT INTO banks_accounts(user_id, name_identifier, url_image, name_bank, type_account, active, color)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, name_identifier, type_account, user_id, url_image`

    const values = [session.user.id, result.data.name_identifier, result.data.url_image, result.data.name_bank, result.data.type_account, result.data.active, result.data.color]

    try {

        const account = client.query(text, values)

        return {message:"Conta criada com sucesso", status: 200, data: (await account).rows[0]}

    } catch (error) {

        console.log("Erro a criar conta", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})