ALTER TABLE credit_card_invoices 
ADD COLUMN date_payment DATE DEFAULT NULL;

COMMENT ON COLUMN credit_card_invoices.date_payment IS 'Data de pagamento da fatura';
