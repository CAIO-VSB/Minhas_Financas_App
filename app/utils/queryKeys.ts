export const QUERY_KEYS = {
    categories: {
        all: ['categories'],
        active: ['categories', 'active']
    },
    accounts: {
        all: ['accounts'],
        active: ['accounts', 'active'],
        getBalanceForAccount: ['getBalanceForAccount']
    },
    creditCards: {
        all: ['credit-cards'],
        disable: ['credit-cards-disable'],
        nextOpenPeriod: ['nextPeriod']
    },
    movements: {
        all: ['movements'],
        only_revenues: ['only-revenues'],
        only_expenses: ['only-expenses'],
        current_balance: ['current-balance'],
        movements_by_filter: ['movements-by-filter']
    },
    tranfer: {
        all: ['transfer']
    },
    auth: {
        all: ['auth']
    },
    movementsCreditCard: {
        byCreditCard: ['byCreditCard'],
        totalInvoice: ['totalInvoice'],
        allMovements: ['allMovements']
    },
    goals: {
        all: ['allGoals'],
        movements: (id: number) => ['movementsGoals', id],
        balance_for_economy: ['balance']
    },
    dashboard: {
        expenseByCategorie: ['expenseByCategorie'],
        renevueByCategorie: ['renevueByCategorie'],
        sumary: ['sumary'],
        cards: ['credit-cards']
    }
}