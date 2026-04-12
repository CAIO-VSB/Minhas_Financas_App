-- Up Migration
CREATE TABLE banks_accounts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES "user"(id),
    name_identifier VARCHAR(45) NOT NULL,
    url_image VARCHAR(100) NOT NULL,
    name_bank VARCHAR(45) NOT NULL,
    active BOOLEAN NOT NULL,
    type_account VARCHAR(30) NOT NULL,
    color VARCHAR(20) NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE banks_accounts IS 'Tabela de contas bancárias do usuário';

COMMENT ON COLUMN banks_accounts.id IS 'Id da conta';
COMMENT ON COLUMN banks_accounts.user_id IS 'Id do usuário logado no ato do cadastro';
COMMENT ON COLUMN banks_accounts.name_identifier IS 'Nome da conta';
COMMENT ON COLUMN banks_accounts.url_image IS 'Imagem do banco';
COMMENT ON COLUMN banks_accounts.name_bank IS 'Nome do banco atrelado a logo';
COMMENT ON COLUMN banks_accounts.active IS 'True = ativo False = desativado';
COMMENT ON COLUMN banks_accounts.type_account IS 'Tipo da conta bancária';
COMMENT ON COLUMN banks_accounts.color IS 'Valor hexadecimal da cor';

-- Down Migration
DROP TABLE IF EXISTS banks_accounts;