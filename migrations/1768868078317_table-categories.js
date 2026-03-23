export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE "categories" (
      "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      "user_id" TEXT REFERENCES "user"("id") ON DELETE CASCADE,
      "name_identifier" TEXT NOT NULL,
      "url_icon" TEXT NOT NULL,
      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "type_categorie" TEXT NOT NULL,
      "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "update_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  pgm.sql(`
    COMMENT ON COLUMN categories.id IS 'Id da categoria';
    COMMENT ON COLUMN categories.user_id IS 'Id do usuário';
    COMMENT ON COLUMN categories.name_identifier IS 'Nome da categoria';
    COMMENT ON COLUMN categories.url_icon IS 'Ícone de categoria';
    COMMENT ON COLUMN categories.active IS 'True = ativa False = desativada';
    COMMENT ON COLUMN categories.type_categorie IS 'Tipo da categoria: Receita ou Despesa';
  `);

};

export const down = (pgm) => {
  pgm.dropTable('categorias');
};
