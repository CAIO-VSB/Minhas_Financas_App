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

        const text = "SELECT * FROM contas ORDER BY id ASC"

        const accounts = client.query(text)

        return (await accounts).rows || "Token ausente"

    } catch (error) {

        console.log("Erro ao tentar criar conta", error)
    }

})