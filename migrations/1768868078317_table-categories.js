export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE "categories" (
      "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "name_identifier" TEXT NOT NULL,
      "url_icon" TEXT NOT NULL,
      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "type_categorie" TEXT NOT NULL,
      "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "update_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS categories;
  `);
};
