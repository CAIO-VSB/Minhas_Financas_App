export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE "categorias" (
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
    COMMENT ON COLUMN categorias.id IS 'Id da categoria';
    COMMENT ON COLUMN categorias.user_id IS 'Id do usuário';
    COMMENT ON COLUMN categorias.name_identifier IS 'Nome da categoria';
    COMMENT ON COLUMN categorias.url_icon IS 'Ícone de categoria';
    COMMENT ON COLUMN categorias.active IS 'True = ativa False = desativada';
    COMMENT ON COLUMN categorias.type_categorie IS 'Tipo da categoria: Receita ou Despesa';
  `);



};

export const down = (pgm) => {
  pgm.dropTable('categorias');
};
