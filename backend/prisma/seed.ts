import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

type BallSeed = {
  name: string;
  nombre?: string;
  type: string;
  descripcion: string;
  level?: number;
};

type FusionSeed = {
  comb: string[];
  result: string;
  resultado?: string;
  origenA?: string;
  origenB?: string;
  descripcion?: string;
  emoji?: string;
  tipo?: string;
  requiredLevel?: number;
};

const dataDir = path.join(__dirname, 'data');

function readJson<T>(fileName: string): T {
  const filePath = path.join(dataDir, fileName);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as T;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

async function main() {
  console.log('🌱 Cargando datos iniciales...');

  const balls = readJson<BallSeed[]>('balls.json');
  const fusions = readJson<FusionSeed[]>('fusions.json');

  await prisma.fusionInput.deleteMany();
  await prisma.fusionRecipe.deleteMany();
  await prisma.evolution.deleteMany();
  await prisma.ball.deleteMany();

  const ballSeeds = new Map<string, BallSeed>();

  for (const ball of balls) {
    ballSeeds.set(ball.name, ball);
  }

  for (const fusion of fusions) {
    if (!ballSeeds.has(fusion.result)) {
      ballSeeds.set(fusion.result, {
        name: fusion.result,
        type: 'Especial',
        descripcion:
          fusion.descripcion ??
          fusion.resultado ??
          `Resultado de la fusión ${fusion.result}`,
        level: 1
      });
    }

    for (const inputName of fusion.comb) {
      if (!ballSeeds.has(inputName)) {
        ballSeeds.set(inputName, {
          name: inputName,
          type: 'Especial',
          descripcion: `Componente de fusión para ${fusion.resultado ?? fusion.result}`,
          level: 1
        });
      }
    }
  }

  const ballIds = new Map<string, number>();

  for (const ball of ballSeeds.values()) {
    const imageSlug = slugify(ball.name);

    const created = await prisma.ball.create({
      data: {
        name: ball.name,
        type: ball.type,
        level: ball.level ?? 1,
        description: ball.descripcion,
        imageUrl: `/images/${imageSlug}.png`
      }
    });

    ballIds.set(created.name, created.id);
  }

  for (const fusion of fusions) {
    const inputIds = fusion.comb
      .map((name) => ballIds.get(name))
      .filter((id): id is number => id !== undefined);

    if (inputIds.length !== fusion.comb.length) {
      console.warn(`⚠️  No se encontraron todas las bolas para la fusión ${fusion.result}`);
      continue;
    }

    const resultId = ballIds.get(fusion.result);
    if (!resultId) {
      console.warn(`⚠️  No se encontró la bola resultado para ${fusion.result}`);
      continue;
    }

    const recipe = await prisma.fusionRecipe.create({
      data: {
        requiredLevel: fusion.requiredLevel ?? 3,
        origenA: fusion.origenA ?? fusion.comb[0] ?? null,
        origenB:
          fusion.origenB ??
          (fusion.comb.length > 1 ? fusion.comb.slice(1).join(' + ') : null),
        resultado: fusion.resultado ?? null,
        descripcion: fusion.descripcion ?? null,
        emoji: fusion.emoji ?? null,
        tipo: fusion.tipo ?? null,
        result: { connect: { id: resultId } }
      }
    });

    if (inputIds.length > 0) {
      await prisma.fusionInput.createMany({
        data: inputIds.map((ballId) => ({
          recipeId: recipe.id,
          ballId
        }))
      });
    }
  }

  console.log('✅ Base de datos inicial cargada correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
