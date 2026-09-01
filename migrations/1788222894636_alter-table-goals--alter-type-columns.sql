ALTER TABLE goals
ADD COLUMN movement_credit_card_id INTEGER DEFAULT NULL;

COMMENT ON COLUMN movements.movement_credit_card_id IS 'ID da movimentação do cartão de crédito';
