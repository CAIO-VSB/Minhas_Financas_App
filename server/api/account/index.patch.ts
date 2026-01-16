import { schemaAccount } from "~/schemas/account.schema"
import { auth } from "~/lib/auth"
import client from "../utils/db"

export default defineEventHandler( async (event) => {

    const session = await auth.api.getSession({
        headers: event.headers
    })

    try {

        if (!session?.session.token) {
            throw new Error("Token de usuário ausente")
        }
            
        const result = await readValidatedBody(event, body => schemaAccount.safeParse(body))

        if (!result.success) {
            return { status: 400, message: "Corpo da requisição inválido"}
        }

        const text = `
        UPDATE contas
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

        const newAccount = client.query(text, values)

        return (await newAccount).rows

    } catch (error) {

        console.log("Erro ao modificar conta", error)
    }

})