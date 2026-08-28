ALTER TABLE movements
ADD COLUMN invoice_id INTEGER DEFAULT NULL;

COMMENT ON COLUMN movements.invoice_id IS 'ID fatura paga';
