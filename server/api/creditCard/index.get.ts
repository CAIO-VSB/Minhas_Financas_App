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
                message: "Token ausente"
            })
        }

        const userId = session?.session.userId

        const text = "SELECT * FROM credit_cards where user_id = $1 ORDER BY id ASC"

        const accounts = client.query(text, [userId])

        return (await accounts).rows 

    } catch (error) {

        console.log("Erro ao tentar buscar cartoes de credio", error)

        throw createError({
            status: 500,
            message: "Erro buscar cartoe de credito"
        })
    }

})