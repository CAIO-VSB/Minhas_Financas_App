import { auth } from "~~/auth"
import client from "~/utils/db"

export default defineEventHandler( async (event) => {

    const session = await auth.api.getSession({
        headers: event.headers
    })

    if (!session?.session.token) {
        throw createError({
            status: 401,
            message: "Unauthorized"
        })
    }

    const userId = session?.session.userId

    const text = 
    `SELECT * FROM categories 
    WHERE user_id IS NULL OR user_id = $1
    ORDER BY user_id IS NULL DESC, name_identifier ASC`

    try {

        const accounts = client.query(text, [userId])

        return (await accounts).rows 

    } catch (error) {

        console.log("Erro ao tentar buscar categorias", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})