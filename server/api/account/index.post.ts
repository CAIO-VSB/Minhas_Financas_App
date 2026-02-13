import { schemaAccount } from "~/schemas/account.schema"
import { auth } from "~/lib/auth"
import client from "../utils/db"

export default defineEventHandler( async (event) => {

    const session = await auth.api.getSession({
        headers: event.headers
    })

    try {

        if (!session?.session.token) {
            return { status: 204, message: "Token de usuário ausente"}
        }
            
        const result = await readValidatedBody(event, body => schemaAccount.safeParse(body))

        if (!result.success) {
            return { status: 400, message: "Corpo da requisição inválido"}
        }

        const text = "INSERT INTO contas(user_id, name_identifier, url_image, name_bank, type_account, color, name_color) VALUES($1, $2, $3, $4, $5, $6, $7)"

        const values = [session.user.id, result.data.name_identifier, result.data.url_image, result.data.name_bank, result.data.type_account, result.data.color, result.data.name_color]

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