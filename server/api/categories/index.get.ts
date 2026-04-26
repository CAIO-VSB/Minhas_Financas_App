import { auth } from "~~/auth"
import { categoriesRepository } from "~~/server/repositories/categories.respository"

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

    const { active } = getQuery(event)

    try {

        return await categoriesRepository.findAll(
            session.session.userId,
            active !== undefined ? active === "true" : undefined
        )

    } catch (error) {

        console.log("Erro ao tentar buscar categorias", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })
    }

})