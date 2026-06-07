-- Up Migration
ALTER TABLE movements
ALTER COLUMN date_transaction TYPE date;
-- Down Migration