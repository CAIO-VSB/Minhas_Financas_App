import { schemaAccount } from "~~/schemas/account.schema"
import { auth } from "~~/app/plugins/auth"
import client from "~/utils/db"

export default defineEventHandler( async (event) => {

    const session = await auth.api.getSession({
        headers: event.headers
    })

    try {

        if (!session?.session.token) {
            throw createError({
                status: 401,
                statusText: "Unauthorized (Token de usuário ausente)"
            })
        }
            
        const result = await readValidatedBody(event, body => schemaAccount.safeParse(body))

        if (!result.success) {
            throw createError({
                status: 400,
                statusText: "Bad request",
                data: {message: "Corpo da requisição inválido", issues: result.error}
            })
        }

        const text = "INSERT INTO bank_accounts(user_id, name_identifier, url_image, name_bank, type_account, color) VALUES($1, $2, $3, $4, $5, $6)"

        const values = [session.user.id, result.data.name_identifier, result.data.url_image, result.data.name_bank, result.data.type_account, result.data.color]

        const account = client.query(text, values)

        return (await account).rows

    } catch (error) {

        console.log("Erro a criar conta", error)

        throw createError({
            status: 500,
            message: "Erro ao criar conta",
            cause: error
        })
    }

})