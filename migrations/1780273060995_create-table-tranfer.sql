-- Up Migration
CREATE TABLE transfer (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES "user"(id),
    value_tranfer NUMERIC(10, 2) NOT NULL,
    date_transfer DATE NOT NULL,
    account_origin INTEGER REFERENCES "banks_accounts"(id),
    account_destination INTEGER REFERENCES "banks_accounts"(id),
    observation VARCHAR(100) NOT NULL,
    is_deleted BOOLEAN,
    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  
);

COMMENT ON TABLE transfer IS 'Tabela de transferências';

COMMENT ON COLUMN transfer.id IS 'Id da tranferência';
COMMENT ON COLUMN transfer.user_id IS 'ID do usuário';
COMMENT ON COLUMN transfer.value_tranfer IS 'Valor da tranferência';
COMMENT ON COLUMN transfer.date_transfer IS 'Data da tranferência';
COMMENT ON COLUMN transfer.account_origin IS 'Conta origem';
COMMENT ON COLUMN transfer.account_destination IS 'Conta destino';
COMMENT ON COLUMN transfer.observation IS 'Observação';
COMMENT ON COLUMN transfer.is_deleted IS 'true ou false';


-- Down Migration
DROP TABLE IF EXISTS transfer;