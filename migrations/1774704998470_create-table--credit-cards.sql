-- Up Migration
CREATE TABLE credit_cards (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES "user"(id),
    accounts_id INTEGER REFERENCES "banks_accounts"(id),
    name_identifier VARCHAR(255) NOT NULL,
    url_logo VARCHAR(255) NOT NULL,
    due_day INTEGER NOT NULL,
    closing_day INTEGER NOT NULL,
    limit_card NUMERIC(10, 2),
    active BOOLEAN NOT NULL,
    four_digits VARCHAR(255) NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


COMMENT ON TABLE credit_cards IS 'Tabela de cartões de crédito do usuário';

COMMENT ON COLUMN credit_cards.id IS 'Id da categoria';
COMMENT ON COLUMN credit_cards.user_id IS 'Id do usuário';
COMMENT ON COLUMN credit_cards.accounts_id IS 'Id da conta débito';
COMMENT ON COLUMN credit_cards.name_identifier IS 'Nome do cartão de crédito';
COMMENT ON COLUMN credit_cards.url_logo IS 'Logo da conta';
COMMENT ON COLUMN credit_cards.due_day IS 'Dia do vencimento da fatura';
COMMENT ON COLUMN credit_cards.closing_day IS 'Dia do fechamento da fatura'; 
COMMENT ON COLUMN credit_cards.limit_card IS 'Limite do cartão de crédito';
COMMENT ON COLUMN credit_cards.active IS 'True = ativa False = desativada';
COMMENT ON COLUMN credit_cards.four_digits is 'Dígitos finais do cartão de crédito';

-- Down Migration
DROP TABLE IF EXISTS credit_cards;