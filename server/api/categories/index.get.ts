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

    const { active } = getQuery(event)

    const text = active !== undefined
    ? `SELECT * FROM categories WHERE (user_id IS NULL OR user_id = $1) AND active = $2 ORDER BY user_id IS NULL, name_identifier ASC`
    : `SELECT * FROM categories WHERE (user_id IS NULL OR user_id = $1) ORDER BY user_id IS NULL, name_identifier ASC`

    const params = active !== undefined
    ? [userId, active === "true"]
    : [userId]

    try {

        const accounts = client.query(text, params)

        return (await accounts).rows 

    } catch (error) {

        console.log("Erro ao tentar buscar categorias", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})