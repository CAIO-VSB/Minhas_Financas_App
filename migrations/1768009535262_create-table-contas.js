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
      "name_color" TEXT NOT NULL,
      "initial_balance" DECIMAL(10, 2),
      "color" TEXT,
      "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "update_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  pgm.sql(`
    COMMENT ON TABLE contas IS 'Tabela de contas bancárias do usuário';

    COMMENT ON COLUMN contas.id IS 'Id da conta';
    COMMENT ON COLUMN contas.user_id IS 'Id do usuário';
    COMMENT ON COLUMN contas.name_identifier IS 'Nome da conta';
    COMMENT ON COLUMN contas.url_image IS 'Imagem do banco';
    COMMENT ON COLUMN contas.name_bank IS 'Nome do banco atrelado a logo';
    COMMENT ON COLUMN contas.active IS 'True = ativo False = desativado';
    COMMENT ON COLUMN contas.type_account IS 'Tipo da conta bancária';
    COMMENT ON COLUMN contas.initial_balance IS 'Valor inicial lançado pelo usuário';
    COMMENT ON COLUMN contas.name_color IS 'Nome que identifica a cor selecionada';
    COMMENT ON COLUMN contas.color IS 'Valor hexadecimal da cor';
  `)
}

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS contas;
  `);
};
