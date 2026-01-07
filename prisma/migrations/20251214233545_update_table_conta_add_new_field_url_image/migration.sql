/*
  Warnings:

  - You are about to drop the column `logo` on the `contas` table. All the data in the column will be lost.
  - Added the required column `name_bank` to the `contas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urlImage` to the `contas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contas` DROP COLUMN `logo`,
    ADD COLUMN `name_bank` VARCHAR(191) NOT NULL,
    ADD COLUMN `urlImage` VARCHAR(191) NOT NULL,
    MODIFY `active` BOOLEAN NOT NULL DEFAULT true;
