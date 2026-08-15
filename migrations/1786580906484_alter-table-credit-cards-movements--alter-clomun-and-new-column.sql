-- Up Migration
ALTER TABLE credit_card_movements RENAME COLUMN is_deleted TO status_movement;

ALTER TABLE credit_card_movements ALTER COLUMN status_movement TYPE varchar(12);

COMMENT ON COLUMN public.credit_card_movements.status_movement
    IS 'Status da movimentação';
