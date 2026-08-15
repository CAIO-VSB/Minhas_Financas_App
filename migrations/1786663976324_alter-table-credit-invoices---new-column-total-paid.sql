ALTER TABLE credit_card_invoices
ADD COLUMN total_paid ;

COMMENT ON COLUMN credit_card_invoices.total_paid IS 'Total pago lançado pelo usuário';