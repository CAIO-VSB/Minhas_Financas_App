-- Up Migration
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES "user"(id),
    name_identifier VARCHAR(60) NOT NULL,
    suggested_value NUMERIC(10, 2),
    goal_value NUMERIC(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    accounts_id INTEGER NOT NULL REFERENCES "banks_accounts"(id),
    active BOOLEAN,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


COMMENT ON TABLE goals IS 'Tabela de economias';

COMMENT ON COLUMN goals.id IS 'Id da economia';
COMMENT ON COLUMN goals.user_id IS 'Id do usuário';
COMMENT ON COLUMN goals.name_identifier IS 'Nome da economia';
COMMENT ON COLUMN goals.suggested_value IS 'Valor sugerido pelo usuário';
COMMENT ON COLUMN goals.goal_value IS 'Valor total';
COMMENT ON COLUMN goals.start_date IS 'Data inicio';
COMMENT ON COLUMN goals.end_date IS 'Data fim';
COMMENT ON COLUMN goals.accounts_id IS 'Conta débito';
COMMENT ON COLUMN goals.active IS 'Economia ativa';


-- Down Migration
DROP TABLE IF EXISTS goals;