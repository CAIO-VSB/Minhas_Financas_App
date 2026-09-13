// server/tasks/invoices/alertInvoices.ts
export default defineTask({
    meta: {
        name: 'faturas:aviso',
        description: 'teste sem nenhum import',
    },
    async run() {
        return { result: 'teste zero imports' }
    },
})