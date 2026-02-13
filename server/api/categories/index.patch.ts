import { auth } from "~/lib/auth"
import client from "../utils/db"
import { schemaCategories } from "~/schemas/categories.schema"

export default defineEventHandler( async (event) => {

    const session = await auth.api.getSession({
        headers: event.headers
    })

    try {

        if (!session?.session.token) {
            throw new Error("Token de usuário ausente")
        }
            
        const result = await readValidatedBody(event, body => schemaCategories.safeParse(body))

        if (!result.success) {
            return { status: 400, message: "Corpo da requisição inválido"}
        }

        const text = `
        UPDATE categorias
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

        const newCategorie = client.query(text, values)

        return (await newCategorie).rows

    } catch (error) {

        console.log("Erro ao modificar categoria", error)
    }

})