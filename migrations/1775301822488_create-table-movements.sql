-- Up Migration
CREATE TABLE movements (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES "user"(id),
    accounts_id INTEGER REFERENCES "banks_accounts"(id),
    categorie_id INTEGER REFERENCES "categories"(id),
    description_transaction VARCHAR(100) NOT NULL,
    type_transaction VARCHAR(40) NOT NULL,
    status_transaction VARCHAR(40) NOT NULL,
    value_transaction NUMERIC(10, 2),
    date_transaction TIMESTAMP NOT NULL,
    observation VARCHAR(100),
    url_recibo VARCHAR(100),
    is_deleted BOOLEAN,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP        
);

COMMENT ON TABLE movements IS 'Tabela de movimentações';

COMMENT ON COLUMN movements.id IS 'Id da movimentação';
COMMENT ON COLUMN movements.user_id IS 'Id do usuário';
COMMENT ON COLUMN movements.accounts_id IS 'Id da conta bancária';
COMMENT ON COLUMN movements.categorie_id IS 'Id da categoria';
COMMENT ON COLUMN movements.description_transaction IS 'Descrição da transação';
COMMENT ON COLUMN movements.type_transaction IS 'Tipo da transação';
COMMENT ON COLUMN movements.status_transaction IS '"Pago", "Recebido", "Pendente",';
COMMENT ON COLUMN movements.value_transaction IS 'Valor da transação';
COMMENT ON COLUMN movements.date_transaction IS 'Data da transação';
COMMENT ON COLUMN movements.observation IS 'Observaçõa da transação';
COMMENT ON COLUMN movements.transfer_id IS 'Id para identificação de transferências';
COMMENT ON COLUMN movements.url_recibo IS 'Foto do recibo de pagamento';
COMMENT ON COLUMN movements.is_deleted IS 'Transação deletada/estornada';


-- Down Migration
DROP TABLE IF EXISTS movements;