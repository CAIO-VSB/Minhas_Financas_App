import { prisma } from "~/lib/prisma"
import { auth } from "~/lib/auth"

export default defineEventHandler( async (event) => {

    const session = await auth.api.getSession({
        headers: event.headers
    })


    try {

        if (!session?.session.token) {
            return { status: 204, message: "Token de usuário ausente"}
        }

        const accounts = await prisma.contas.findMany()

        console.log("Console no bakc e na rota", accounts)

        return accounts

    } catch (error) {

        console.log("Erro ao tentar criar conta", error)
    }

})