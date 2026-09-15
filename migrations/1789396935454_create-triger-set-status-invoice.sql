CREATE OR REPLACE FUNCTION fn_set_invoice_expired()
RETURNS TRIGGER AS $$
BEGIN

    -- 1. Fecha faturas "abertas" cuja data de fechamento já passou
    UPDATE credit_card_invoices
    SET status_invoice = 'fechada'
    WHERE status_invoice = 'aberta'
        AND closing_date < CURRENT_DATE;

    -- 2. Promove a próxima fatura "parcial" de cada cartão para "aberta"
    UPDATE credit_card_invoices cci
    SET status_invoice = 'aberta'
    FROM (
        SELECT DISTINCT ON (credit_card_id) id, credit_card_id
        FROM credit_card_invoices
        WHERE status_invoice = 'parcial'
        ORDER BY credit_card_id, invoice_year, invoice_month
    ) AS proxima
    WHERE cci.id = proxima.id
        AND NOT EXISTS (
            SELECT 1 FROM credit_card_invoices cci2
            WHERE cci2.credit_card_id = proxima.credit_card_id
                AND cci2.status_invoice = 'aberta'
        );

    -- 3. Marca como "vencida" fatura fechada (não paga) que passou do vencimento
    UPDATE credit_card_invoices cci
    SET status_invoice = 'vencida'
    FROM credit_cards cc
    WHERE cc.id = cci.credit_card_id
        AND cci.status_invoice = 'fechada'
        AND make_date(cci.invoice_year, cci.invoice_month, cc.due_day) < CURRENT_DATE;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

