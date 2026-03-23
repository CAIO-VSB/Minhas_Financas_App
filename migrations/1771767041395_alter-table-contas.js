export const up = (pgm) => {
  pgm.sql(`
    ALTER TABLE "bank_accounts" 
    DROP COLUMN name_color
  `);

};
