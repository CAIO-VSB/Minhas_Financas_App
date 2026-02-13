
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
            throw new Error("Corpo da requisição inválido")
        }

        const text = "INSERT INTO categorias(user_id, name_identifier, url_icon, active, type_categorie) VALUES($1, $2, $3, $4, $5) RETURNING id, name_identifier, url_icon, active, type_categorie"

        const values = [session.user.id, result.data.name_identifier, result.data.url_icon, result.data.active, result.data.type_categorie]

        const categorie = client.query(text, values)

        return {message:"Categoria criada com sucesso", status: 200, data: (await categorie).rows[0]}

    } catch (error) {
        console.log("Erro a criar categoria", error)
        throw createError({
            status: 500,
            message: "Erro ao criar categoria"
        })
    }

})