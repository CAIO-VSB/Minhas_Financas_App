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

        const userId = session?.session.userId

        const text = "SELECT * FROM categorias WHERE user_id IS NULL OR user_id = $1 ORDER BY user_id IS NULL DESC, name_identifier ASC"

        const accounts = client.query(text, [userId])

        return (await accounts).rows 

    } catch (error) {

        console.log("Erro ao tentar buscar categorias", error)

        throw createError({
            status: 500,
            message: "Erro buscar categorias"
        })
    }

})