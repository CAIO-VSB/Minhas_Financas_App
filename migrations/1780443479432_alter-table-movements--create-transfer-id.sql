-- Up Migration
ALTER TABLE movements
ADD COLUMN tranfer_id INTEGER REFERENCES transfer(id) ON DELETE SET NULL;

COMMENT ON COLUMN movements.tranfer_id IS 'ID da tranferência';

-- Down Migration
DROP COLUMN IF EXISTS tranfer_id