-- Up Migration
CREATE TABLE credit_card_invoices (
    id SERIAL PRIMARY KEY,
    credit_card_id INTEGER REFERENCES "credit_cards"(id),
    invoice_month INTEGER NOT NULL,
    invoice_year INTEGER NOT NULL,
    status_invoice VARCHAR(15) NOT NULL DEFAULT 'aberta',
    closing_date DATE,
    total_value  NUMERIC(10, 2),
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE credit_card_invoices IS 'Tabela de fatura';

COMMENT ON COLUMN credit_card_invoices.id IS 'Id da fatura';
COMMENT ON COLUMN credit_card_invoices.credit_card_id IS 'Id do cartão de crédito';
COMMENT ON COLUMN credit_card_invoices.invoice_month IS 'Mês da fatura';
COMMENT ON COLUMN credit_card_invoices.invoice_year IS 'Mês da fatura';
COMMENT ON COLUMN credit_card_invoices.status_invoice IS 'Status da fatura';
COMMENT ON COLUMN credit_card_invoices.closing_date IS 'Data de fechamento da fatura';
COMMENT ON COLUMN credit_card_invoices.total_value IS 'Total da fatura';

-- Down Migration
DROP TABLE IF EXISTS credit_card_invoices