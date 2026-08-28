ALTER TABLE credit_card_invoices
ADD COLUMN accounts_id INTEGER DEFAULT NULL;

COMMENT ON COLUMN credit_card_invoices.accounts_id IS 'ID da conta pagamento';
