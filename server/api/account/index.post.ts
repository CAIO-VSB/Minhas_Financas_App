import { prisma } from "~/lib/prisma"
import type { TAccount } from "~/server/types/Taccount.api.type"
import { schemaAccount } from "~/schemas/account.schema"
import { auth } from "~/lib/auth"


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

        const account: TAccount = await prisma.contas.create({
            data: {
                name: result.data.name,
                name_bank: result.data.nameBank,
                type: result.data.type,
                userId: session?.user.id,
                color: result.data.color,
                urlImage: result.data.urlImage,
                active: true
            }
        })

        return account

    } catch (error) {
        console.log("Erro ao tentar criar conta", error)
    }

})