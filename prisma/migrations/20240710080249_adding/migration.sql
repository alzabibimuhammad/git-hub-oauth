/*
  Warnings:

  - Added the required column `repo_url` to the `repository` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "repository_userName_key";

-- AlterTable
ALTER TABLE "repository" ADD COLUMN     "repo_url" TEXT NOT NULL;
