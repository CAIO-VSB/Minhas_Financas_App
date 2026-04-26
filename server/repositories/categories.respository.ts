import client from "~/utils/db"

export const categoriesRepository = {
    
    async findAll(userId: string, active?: boolean) {

    const text = active !== undefined
        ? `SELECT * FROM categories WHERE (user_id IS NULL OR user_id = $1) AND active = $2 ORDER BY user_id IS NULL, name_identifier ASC`
        : `SELECT * FROM categories WHERE (user_id IS NULL OR user_id = $1) ORDER BY user_id IS NULL, name_identifier ASC`

        const params = active !== undefined ? [userId, active === true] : [userId]

        const accounts = client.query(text, params)

        return (await accounts).rows 

    },

    async create(userId: string, data: {name_identifier: string, url_icon: string, active: boolean, type_categorie: string}) {

        const text = `
        INSERT INTO categories(user_id, name_identifier, url_icon, active, type_categorie) 
        VALUES($1, $2, $3, $4, $5) 
        RETURNING id, name_identifier, url_icon, active, type_categorie`

        const values = [userId, data.name_identifier, data.url_icon, data.active, data.type_categorie]

        const categorie = client.query(text, values)

        return {message:"Categoria criada com sucesso", status: 200, data: (await categorie).rows[0]}
        
    },

    async update(data: {name_identifier: string, url_icon: string, active: boolean, type_categorie: string, id?: number}) {

        const text = `
            UPDATE categories
            SET
                name_identifier = $1,
                url_icon = $2,
                active = $3,
                type_categorie = $4
            WHERE id = $5
            RETURNING *
        ` 
        const values = [data.name_identifier, data.url_icon, data.active, data.type_categorie, data.id]

        const newCategorie = client.query(text, values)

        return (await newCategorie).rows

    }

    

}