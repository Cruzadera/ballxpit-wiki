/*
  Warnings:

  - You are about to drop the column `level` on the `Ball` table. All the data in the column will be lost.
  - You are about to drop the column `baseBallId` on the `Evolution` table. All the data in the column will be lost.
  - You are about to drop the column `evolvedBallId` on the `Evolution` table. All the data in the column will be lost.
  - You are about to drop the column `requiredLevel` on the `Evolution` table. All the data in the column will be lost.
  - Added the required column `slug` to the `Ball` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseId` to the `Evolution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resultId` to the `Evolution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Evolution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Evolution` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE IF EXISTS "FusionComponent";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE IF EXISTS "Fusion";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE IF EXISTS "FusionInput";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE IF EXISTS "FusionRecipe";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Character" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionEs" TEXT,
    "startingBallEn" TEXT,
    "startingBallEs" TEXT,
    "unlockRequirementEn" TEXT,
    "unlockRequirementEs" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nombre" TEXT,
    "description" TEXT,
    "descripcion" TEXT,
    "imageUrl" TEXT,
    "type" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Passive" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "description_en" TEXT,
    "description_es" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PassiveEvolution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "components_en" TEXT NOT NULL,
    "components_es" TEXT NOT NULL,
    "result_en" TEXT NOT NULL,
    "result_es" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ball" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nombre" TEXT,
    "description" TEXT,
    "descripcion" TEXT,
    "imageUrl" TEXT,
    "type" TEXT,
    "isPure" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Ball" ("createdAt", "description", "id", "imageUrl", "name", "type", "updatedAt") SELECT "createdAt", "description", "id", "imageUrl", "name", "type", "updatedAt" FROM "Ball";
DROP TABLE "Ball";
ALTER TABLE "new_Ball" RENAME TO "Ball";
CREATE UNIQUE INDEX "Ball_slug_key" ON "Ball"("slug");
CREATE TABLE "new_Evolution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "baseId" INTEGER NOT NULL,
    "resultId" INTEGER NOT NULL,
    "description" TEXT,
    "descripcion" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Evolution_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "Ball" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Evolution_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Ball" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Evolution" ("id") SELECT "id" FROM "Evolution";
DROP TABLE "Evolution";
ALTER TABLE "new_Evolution" RENAME TO "Evolution";
CREATE UNIQUE INDEX "Evolution_slug_key" ON "Evolution"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Character_slug_key" ON "Character"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Item_slug_key" ON "Item"("slug");
