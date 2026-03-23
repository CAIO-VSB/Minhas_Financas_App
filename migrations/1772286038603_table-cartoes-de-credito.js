export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE "credit_cards" (
      "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      "user_id" TEXT REFERENCES "user"("id") ON DELETE CASCADE,
      "accounts_id" INTEGER REFERENCES "bank_accounts"("id") ON DELETE CASCADE,
      "type_card" TEXT NOT NULL,
      "name_identifier" TEXT NOT NULL,
      "url_logo" TEXT NOT NULL,
      "due_day" INTEGER NOT NULL,
      "closing_day" INTEGER NOT NULL,
      "limit" numeric(10, 2),
      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "update_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  pgm.sql(`
    COMMENT ON TABLE credit_cards IS 'Tabela de cartões de crédito do usuário';

    COMMENT ON COLUMN credit_cards.id IS 'Id da categoria';
    COMMENT ON COLUMN credit_cards.user_id IS 'Id do usuário';
    COMMENT ON COLUMN credit_cards.accounts_id IS 'Id da conta débito';
    COMMENT ON COLUMN credit_cards.type_card IS 'Tipo da conta';
    COMMENT ON COLUMN credit_cards.name_identifier IS 'Nome do cartão de crédito';
    COMMENT ON COLUMN credit_cards.url_logo IS 'Logo da conta';
    COMMENT ON COLUMN credit_cards.due_day IS 'Dia do vencimento da fatura';
    COMMENT ON COLUMN credit_cards.closing_day IS 'Dia do fechamento da fatura';
    COMMENT ON COLUMN credit_cards.limit IS 'Limite do cartão de crédito';
    COMMENT ON COLUMN credit_cards.active IS 'True = ativa False = desativada';
  `);

  export const down = (pgm) => {
    pgm.dropTable('categories');
  };


};