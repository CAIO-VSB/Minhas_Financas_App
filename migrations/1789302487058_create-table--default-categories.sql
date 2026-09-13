CREATE TABLE default_categories (
    id SERIAL PRIMARY KEY,
    name_identifier VARCHAR(30) NOT NULL,
    url_icon VARCHAR(50) NOT NULL,
    type_categorie VARCHAR(20) NOT NULL
);

INSERT INTO default_categories (name_identifier, url_icon, type_categorie)
SELECT name_identifier, url_icon, type_categorie
FROM categories
WHERE user_id IS NULL
  AND id NOT IN (15, 16, 17, 18, 19);

  

COMMENT ON TABLE default_categories IS 'Tabela padrão de categorias';