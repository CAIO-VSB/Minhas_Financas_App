import client from "~/utils/db"

export const authRepository = {
    
    async findAll(userId: string) {
        
        const text = 
        `SELECT * FROM account WHERE "userId" = $1`

        const query = client.query(text, [userId])

        return (await query).rows
    },

}