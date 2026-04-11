-- Up Migration
CREATE TABLE categories (
    ID SERIAL PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES "user"(id),
    name_identifier VARCHAR(50) NOT NULL,
    url_icon VARCHAR(30) NOT NULL,
    active BOOLEAN NOT NULL,
    type_categorie VARCHAR(30) NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE categories is 'Tabela de categorias';

COMMENT ON COLUMN categories.id IS 'Id da categoria';
COMMENT ON COLUMN categories.user_id IS 'Id do usuário logado no ato do cadastro';
COMMENT ON COLUMN categories.name_identifier IS 'Nome da categoria';
COMMENT ON COLUMN categories.url_icon IS 'Ícone de categoria';
COMMENT ON COLUMN categories.active IS 'True = ativa False = desativada';
COMMENT ON COLUMN categories.type_categorie IS 'Tipo da categoria: Receita ou Despesa';

-- Down Migration
DROP TABLE IF EXISTS categories;