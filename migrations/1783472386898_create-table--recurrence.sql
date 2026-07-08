-- Up Migration
CREATE TABLE recurrence (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES "user"(id),
    description_recurrence VARCHAR(45) NOT NULL,
    accounts_id INTEGER REFERENCES "banks_accounts"(id),
    categorie_id INTEGER REFERENCES "categories"(id),
    type_recurrence VARCHAR(15) NOT NULL,
    frequency_recurrence VARCHAR(15) NOT NULL,
    total_installments INTEGER,
    day_maturity DATE NOT NULL,
    day_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE recurrence is 'Tabela de recorrências';

COMMENT ON COLUMN recurrence.id IS 'Id da recorrência';
COMMENT ON COLUMN recurrence.user_id IS 'Id do usuário';
COMMENT ON COLUMN recurrence.accounts_id IS 'Id da conta bancária';
COMMENT ON COLUMN recurrence.categorie_id IS 'Id da categoria';
COMMENT ON COLUMN recurrence.type_recurrence IS 'Tipo de recorrência - fixo | parcelado';
COMMENT ON COLUMN recurrence.frequency_recurrence IS 'Frequência da recorrência - dias | semanas | meses | anos';
COMMENT ON COLUMN recurrence.total_installments IS 'Total de parcelas';
COMMENT ON COLUMN recurrence.day_maturity IS 'Data vencimento';
COMMENT ON COLUMN recurrence.day_start IS 'Data de início';
COMMENT ON COLUMN recurrence.is_active IS 'True = ativa False = desativada';

-- Down Migration
DROP TABLE IF EXISTS recurrence;

-- Down Migration