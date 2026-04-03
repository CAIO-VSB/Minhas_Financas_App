import { auth } from "~~/auth"
import client from "~/utils/db"
import { schemaCategories } from "~~/schemas/categories.schema"

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

    const text = `
    UPDATE categories
    SET
        name_identifier = $1,
        url_icon = $2,
        active = $3,
        type_categorie = $4,
        update_at = NOW()
    WHERE id = $5
    RETURNING *
    `

    const values = [result.data.name_identifier, result.data.url_icon, result.data.active, result.data.type_categorie, result.data.id]

    try {

        const newCategorie = client.query(text, values)

        return (await newCategorie).rows

    } catch (error) {

        console.log("Erro ao modificar categoria", error)

        throw createError({
            status: 500,
            statusMessage: "Internal Server Error"
        })

    }

})