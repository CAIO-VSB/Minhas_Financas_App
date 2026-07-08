-- Up Migration
ALTER TABLE movements
ADD COLUMN recurrence_id INTEGER REFERENCES recurrence(id) ON DELETE SET NULL;

COMMENT ON COLUMN movements.recurrence_id IS 'ID da recorrência';

-- Down Migration
DROP COLUMN IF EXISTS recurrence_id;

-- Down Migration