import client from "~/utils/db"

export const authRepository = {
    
    async findAll(userId: string) {
        
        const text = 
        `SELECT * FROM account WHERE "userId" = $1`

        const query = client.query(text, [userId])

        return (await query).rows
    },

    async updateImageUser(urlImage: string, userId: string) {

        console.log("Chamou aqui " + urlImage, userId)
        
        const text = 
        `UPDATE public.user
            SET image = $1
        WHERE id = $2    
        `

        const query = client.query(text, [urlImage, userId])

        return (await query).rows
    },

}