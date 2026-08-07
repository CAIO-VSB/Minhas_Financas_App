
ALTER TABLE movements
ADD COLUMN installment_current INTEGER;

COMMENT ON COLUMN movements.installment_current IS 'Número de parcelas caso seja conta parcelada';



