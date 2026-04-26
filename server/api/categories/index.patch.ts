import { auth } from "~~/auth"
import client from "~/utils/db"
import { schemaCategories } from "~~/schemas/categories.schema"
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
        
    const result = await readValidatedBody(event, body => schemaCategories.safeParse(body))

    if (!result.success) {
        throw createError({
            status: 422,
            statusMessage: "Unprocessable Entity"
        })
    }
    

    try {

        return await categoriesRepository.update(result.data)

    } catch (error) {

        console.log("Erro ao modificar categoria", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })

    }

})