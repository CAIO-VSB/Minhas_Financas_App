import client from "~/utils/db"
import type { DonutDatum } from '~/composables/useVueCharts/useDonuChart'

export const dashboardRepository = {
    
    async findAllRenevueByCategorie(userId: string, month: number, year: number): Promise<DonutDatum []> {
        
        const text = 
        `SELECT * FROM fn_receitas_por_categoria($1, $2, $3)`

        const result = client.query(text, [userId, month, year])

        return (await result).rows.map(r => ({
            name: r.categoria,
            value: Number(r.valor)
        }))
    },

    async findAllExpenseByCategorie(userId: string, month: number, year: number): Promise<DonutDatum []> {
        
        const text = 
        `SELECT * FROM fn_despesas_por_categoria($1, $2, $3)`

        const result = client.query(text, [userId, month, year])

        return (await result).rows.map(r => ({
            name: r.categoria,
            value: Number(r.valor)
        }))
    },

    async findAllCardSummary(userId: string, month: number, year: number) {
        
        const text = 
        `SELECT * FROM fn_dashboard_summary($1, $2, $3)`

        const result = client.query(text, [userId, month, year])

        return (await result).rows
    },

    async findValueByCreditCard(userId: string, month: number, year: number) {
        
        const text = 
        `SELECT * FROM fn_dashboard_total_credit_card($1, $2, $3)`

        const result = client.query(text, [userId, month, year])

        return (await result).rows
    },

    async findLastMovements(userId: string, month: number, year: number) {
        
        const text = 
        `SELECT * FROM fn_last_movements($1, $2, $3)`

        const result = client.query(text, [userId, month, year])

        return (await result).rows
    },

    async findExpensesByThreeMonths(userId: string, month: number, year: number) {
        
        const text = 
        `SELECT * FROM fn_gastos_3_meses($1, $2, $3)`

        const result = await client.query(text, [userId, month, year])

        return result.rows.map((r) => {
            const ano = r.mes_referencia.getFullYear()
            const mes = String(r.mes_referencia.getMonth() + 1).padStart(2, '0')

            return {
                name: `${mes}/${ano}`,
                value: Number(r.total),
            }
        })
    },

    async findBalanceEvolution(userId: string, month: number, year: number) {
        
        const text = 
        `SELECT * FROM fn_evolucao_saldo($1, $2, $3)`

        const result = await client.query(text, [userId, month, year])

        return result.rows.map((r) => {
            const ano = r.mes_referencia.getFullYear()
            const mes = String(r.mes_referencia.getMonth() + 1).padStart(2, '0')

            return {
                name: `${mes}/${ano}`,
                value: Number(r.saldo_acumulado),
            }
        })
    }
}