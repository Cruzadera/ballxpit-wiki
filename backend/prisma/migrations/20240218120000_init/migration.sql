-- CreateTable
CREATE TABLE "Ball" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Ball_name_key" ON "Ball"("name");

-- CreateTable
CREATE TABLE "FusionRecipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requiredLevel" INTEGER NOT NULL,
    "resultId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FusionRecipe_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Ball" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FusionInput" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipeId" INTEGER NOT NULL,
    "ballId" INTEGER NOT NULL,
    CONSTRAINT "FusionInput_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "FusionRecipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FusionInput_ballId_fkey" FOREIGN KEY ("ballId") REFERENCES "Ball" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Evolution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requiredLevel" INTEGER NOT NULL,
    "baseBallId" INTEGER NOT NULL,
    "evolvedBallId" INTEGER NOT NULL,
    CONSTRAINT "Evolution_baseBallId_fkey" FOREIGN KEY ("baseBallId") REFERENCES "Ball" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Evolution_evolvedBallId_fkey" FOREIGN KEY ("evolvedBallId") REFERENCES "Ball" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
