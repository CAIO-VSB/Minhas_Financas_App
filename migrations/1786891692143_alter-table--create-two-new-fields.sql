ALTER TABLE credit_card_movements 
ADD COLUMN refund_of_movement_id INTEGER;


ALTER TABLE credit_card_movements 
ADD COLUMN description_reversal VARCHAR(45);

COMMENT ON COLUMN credit_card_movements.refund_of_movement_id IS 'ID da movimentação referenciada ao estorno';
COMMENT ON COLUMN credit_card_movements.description_reversal IS 'Descrição do estorno';