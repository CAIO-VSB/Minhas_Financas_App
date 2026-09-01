-- Up Migration
CREATE TABLE goals_movements (
    id SERIAL PRIMARY KEY,
    goals_id INTEGER REFERENCES "goals"(id),
    description VARCHAR(60) NOT NULL,
    value_paid NUMERIC(10, 2) NOT NULL,
    date_movement DATE NOT NULL,
    accounts_id INTEGER NOT NULL REFERENCES "banks_accounts"(id),
    is_deleted BOOLEAN,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


COMMENT ON TABLE goals_movements IS 'Tabela de movimentações da economia';

COMMENT ON COLUMN goals_movements.id IS 'Id da economia';
COMMENT ON COLUMN goals_movements.goals_id IS 'Id da economia';
COMMENT ON COLUMN goals_movements.description IS 'Descrição do lançamento';
COMMENT ON COLUMN goals_movements.value_paid IS 'Valor lançado pelo usuário';
COMMENT ON COLUMN goals_movements.date_movement IS 'Data da movimentação';
COMMENT ON COLUMN goals_movements.accounts_id IS 'Conta débito';
COMMENT ON COLUMN goals_movements.is_deleted IS 'Movimentação deletada';



-- Down Migration
DROP TABLE IF EXISTS goals_movements;