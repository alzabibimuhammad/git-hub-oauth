/*
  Warnings:

  - A unique constraint covering the columns `[sha]` on the table `commits` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sha` to the `commits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "commits" ADD COLUMN     "sha" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "commits_sha_key" ON "commits"("sha");
