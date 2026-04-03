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

    const userId = session?.session.userId

    const { active } = getQuery(event)

    const text = active !== undefined
    ? `SELECT * FROM credit_cards WHERE user_id = $1 AND active = $2 ORDER BY id ASC`
    : `SELECT * FROM credit_cards WHERE user_id = $1 ORDER BY id ASC`

    const params = active !== undefined
    ? [userId, active === "true"]
    : [userId]

    try {

        const accounts = client.query(text, params)

        return (await accounts).rows 

    } catch (error) {

        console.log("Erro ao tentar buscar cartoes de credio", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})