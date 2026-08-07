-- Up Migration
CREATE TABLE credit_card_movements (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES "user"(id),
    credit_card_id INTEGER REFERENCES "credit_cards"(id),
    invoice_id INTEGER REFERENCES "credit_card_invoices"(id),
    categoria_id INTEGER REFERENCES "categories"(id),
    description_credit VARCHAR(45) NOT NULL,
    value_transaction NUMERIC(10, 2) NOT NULL, 
    purchase_date DATE, 
    installment_number INTEGER, 
    installment_total INTEGER,
    recurrence_id INTEGER,
    is_deleted BOOLEAN DEFAULT FALSE,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE credit_card_movements IS 'Tabela de movimentações do cartão de crédito';

COMMENT ON COLUMN credit_card_movements.id IS 'Id da movimentação';
COMMENT ON COLUMN credit_card_movements.user_id IS 'Id do usuário';
COMMENT ON COLUMN credit_card_movements.credit_card_id IS 'Id do cartão de crédito';
COMMENT ON COLUMN credit_card_movements.invoice_id IS 'Id da fatura';
COMMENT ON COLUMN credit_card_movements.categoria_id IS 'Id da categoria';
COMMENT ON COLUMN credit_card_movements.description_credit IS 'Descrição da movimentação';
COMMENT ON COLUMN credit_card_movements.value_transaction IS 'Valor da movimentação';
COMMENT ON COLUMN credit_card_movements.purchase_date IS 'Data da compra';
COMMENT ON COLUMN credit_card_movements.installment_number IS 'Parcela atual';
COMMENT ON COLUMN credit_card_movements.installment_total IS 'Total das parcelas';
COMMENT ON COLUMN credit_card_movements.recurrence_id IS 'Id da recorrência';
COMMENT ON COLUMN credit_card_movements.is_deleted IS 'Movimentação deletada?';

-- Down Migration
DROP TABLE IF EXISTS credi_card_movements