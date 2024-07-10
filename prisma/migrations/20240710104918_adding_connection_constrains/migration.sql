/*
  Warnings:

  - A unique constraint covering the columns `[sha,pullsNumber,repo_name]` on the table `commits` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[repo_name,number]` on the table `pulls` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `repo_name` to the `commits` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "commits" DROP CONSTRAINT "commits_pullsNumber_fkey";

-- DropIndex
DROP INDEX "pulls_number_key";

-- AlterTable
ALTER TABLE "commits" ADD COLUMN     "repo_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "commits_sha_pullsNumber_repo_name_key" ON "commits"("sha", "pullsNumber", "repo_name");

-- CreateIndex
CREATE UNIQUE INDEX "pulls_repo_name_number_key" ON "pulls"("repo_name", "number");

-- AddForeignKey
ALTER TABLE "commits" ADD CONSTRAINT "commits_pullsNumber_repo_name_fkey" FOREIGN KEY ("pullsNumber", "repo_name") REFERENCES "pulls"("number", "repo_name") ON DELETE RESTRICT ON UPDATE CASCADE;
