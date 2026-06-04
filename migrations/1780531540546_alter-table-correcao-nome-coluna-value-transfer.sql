-- Up Migration
ALTER TABLE transfer
RENAME COLUMN value_tranfer TO value_transfer;
-- Down Migration