-- CreateTable
CREATE TABLE "repository" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "createdAtRepo" TIMESTAMP(3) NOT NULL,
    "createdAtDB" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pulls" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'closed',
    "commits_url" TEXT NOT NULL,
    "repo_name" TEXT NOT NULL,
    "merged_at" TIMESTAMP(3) NOT NULL,
    "createdAtDB" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pulls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commits" (
    "id" TEXT NOT NULL,
    "pullsNumber" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAtDB" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "repository_name_key" ON "repository"("name");

-- CreateIndex
CREATE UNIQUE INDEX "repository_userName_key" ON "repository"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "pulls_number_key" ON "pulls"("number");

-- AddForeignKey
ALTER TABLE "pulls" ADD CONSTRAINT "pulls_repo_name_fkey" FOREIGN KEY ("repo_name") REFERENCES "repository"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commits" ADD CONSTRAINT "commits_pullsNumber_fkey" FOREIGN KEY ("pullsNumber") REFERENCES "pulls"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
