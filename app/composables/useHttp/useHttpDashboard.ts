export function useHttpDashboard() {

    const getRenevueByCategorie = (month: number, year: number) => {
        return $fetch("/api/dashboard/renevueByCategorie", {method: "GET", query: {month: month, year: year}})
    }
    
    const getExpenseByCategorie = (month: number, year: number) => {
        return $fetch("/api/dashboard/expenseByCategorie", {method: "GET", query: {month: month, year: year}})
    }

    const getAllSumary = (month: number, year: number) => {
        return $fetch("/api/dashboard/sumary", {method: "GET", query: {month: month, year: year}})
    }

    const getTotalByCards = (month: number, year: number) => {
        return $fetch("/api/dashboard/byCreditCard", {method: "GET", query: {month: month, year: year}})
    }

    const getLastMovements = (month: number, year: number) => {
        return $fetch("/api/dashboard/lastMovements", {method: "GET", query: {month: month, year: year}})
    }

    return {
        getExpenseByCategorie,
        getRenevueByCategorie,
        getAllSumary,
        getTotalByCards,
        getLastMovements
    }

}