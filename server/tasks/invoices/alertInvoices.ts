import { invoiceRepository} from '~~/server/repositories/invoices.repository'
import { invoiceClosingTemplate } from '~~/server/templates/invoiceTemplateEmail'
import { Resend } from 'resend'

export default defineTask({
    meta: {
        description: 'Busca faturas fechando/vencendo hoje e envia e-mails via Resend',
    },

    async run() {

        
        const resend = new Resend(process.env.RESEND_API_KEY)

        const invoices = await invoiceRepository.sendEmailByInvoice()

        if (invoices.length === 0) {
            return {result: `Nenhuma fatura para hoje`}
        }

        const emailBatch = invoices.map((invoice) => ({
            from: 'Velto Finance <time@veltofinance.bid>',
            to: [invoice.user_email],
            subject: `Sua fatura do ${invoice.bank_name} fecha hoje`,
            html: invoiceClosingTemplate({...invoice, tipo: 'fechamento'})
        }))

        const chunk = <T>(arr: T[], size: number): T[][] =>
            Array.from({length: Math.ceil(arr.length / size)}, (_, i) => arr.slice(i * size, i * size + size))

        for (const batch of chunk(emailBatch, 100)) {
            const { error } = await resend.batch.send(batch)
            if (error) console.error('Falha no lote: ', error)
        }

        return {result: `${invoices.length} avisos processados`}
            
    }
})