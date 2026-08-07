-- Up Migration
ALTER TABLE credit_card_movements RENAME COLUMN categoria_id TO categorie_id;
ALTER TABLE credit_card_movements ADD COLUMN observation VARCHAR(100);
