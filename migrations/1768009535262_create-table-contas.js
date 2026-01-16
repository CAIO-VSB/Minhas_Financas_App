export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE "contas" (
      "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "name_identifier" TEXT NOT NULL,
      "url_image" TEXT NOT NULL,
      "name_bank" TEXT NOT NULL,
      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "type_account" TEXT NOT NULL,
      "initial_balance" DECIMAL(10, 2),
      "color" TEXT,
      "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "update_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS contas;
  `);
};
