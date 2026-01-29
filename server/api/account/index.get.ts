import { auth } from "~/lib/auth"
import client from "../utils/db"

export default defineEventHandler( async (event) => {

    const session = await auth.api.getSession({
        headers: event.headers
    })

    const userId = session?.session.userId

    try {

        if (!session?.session.token) {
            throw new Error("Token de usuário ausente")
        }

        const text = "SELECT * FROM contas where user_id = $1 ORDER BY id ASC"

        const accounts = client.query(text, [userId])

        return (await accounts).rows 

    } catch (error) {

        console.log("Erro ao tentar buscar contas", error)
    }

})