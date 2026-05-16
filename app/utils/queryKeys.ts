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
        disable: ['credit-cards-disable']
    },
    movements: {
        all: ['movements'],
        only_revenues: ['only-revenues'],
        only_expenses: ['only-expenses'],
        current_balance: ['current-balance']
    }
}