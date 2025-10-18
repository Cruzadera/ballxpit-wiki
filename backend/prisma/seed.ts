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

type BallRecord = BallSeed & {
  tipo?: 'pura' | 'fusion' | 'evolucion';
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

  await prisma.evolutionComponent.deleteMany();
  await prisma.evolution.deleteMany();
  await prisma.fusionInput.deleteMany();
  await prisma.fusionRecipe.deleteMany();
  await prisma.ball.deleteMany();

  const ballSeeds = new Map<string, BallRecord>();

  const registerBall = (seed: BallRecord) => {
    const existing = ballSeeds.get(seed.name);
    if (existing) {
      existing.descripcion = existing.descripcion || seed.descripcion;
      existing.nombre = existing.nombre || seed.nombre;
      existing.type = existing.type || seed.type;
      existing.level = existing.level || seed.level;
      existing.tipo = seed.tipo ?? existing.tipo;
      return existing;
    }

    const record: BallRecord = {
      ...seed,
      nombre: seed.nombre ?? seed.name
    };

    ballSeeds.set(seed.name, record);
    return record;
  };

  for (const ball of balls) {
    registerBall({ ...ball, tipo: 'pura' });
  }

  const fusionResultNames = new Set<string>();
  const evolutionResultNames = new Set<string>();

  type PreparedFusion = {
    fusionName: string;
    evolutionName: string;
    seed: FusionSeed;
  };

  const preparedFusions: PreparedFusion[] = [];
  const preparedEvolutions: PreparedFusion[] = [];

  for (const fusion of fusions) {
    const components = fusion.comb.map((name) => name.trim()).filter(Boolean);
    if (components.length === 0) {
      continue;
    }

    const fusionName = components.join(' x ');
    const evolutionName = fusion.result.trim();

    preparedFusions.push({ fusionName, evolutionName, seed: fusion });

    fusionResultNames.add(fusionName);
    const fusionDescription =
      fusion.descripcion ?? `Fusión directa de ${components.join(' + ')}`;

    registerBall({
      name: fusionName,
      nombre: fusionName,
      type: 'Combinación',
      descripcion: fusionDescription,
      level: fusion.requiredLevel ?? 3,
      tipo: 'fusion'
    });

    if (evolutionName !== fusionName) {
      preparedEvolutions.push({ fusionName, evolutionName, seed: fusion });
      evolutionResultNames.add(evolutionName);

      registerBall({
        name: evolutionName,
        nombre: evolutionName,
        type: 'Especial',
        descripcion:
          fusion.descripcion ??
          fusion.resultado ??
          `Evolución avanzada de ${components.join(' + ')}`,
        level: (fusion.requiredLevel ?? 3) + 1,
        tipo: 'evolucion'
      });
    }

    for (const inputName of components) {
      registerBall({
        name: inputName,
        nombre: inputName,
        type: 'Especial',
        descripcion: `Componente requerido para ${evolutionName}`,
        level: 1
      });
    }
  }

  for (const seed of ballSeeds.values()) {
    if (fusionResultNames.has(seed.name)) {
      seed.tipo = 'fusion';
    } else if (evolutionResultNames.has(seed.name)) {
      seed.tipo = 'evolucion';
    } else {
      seed.tipo = seed.tipo ?? 'pura';
    }
  }

  const ballIds = new Map<string, number>();

  const orderedBalls = Array.from(ballSeeds.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  for (const ball of orderedBalls) {
    const imageSlug = slugify(ball.name);
    const descripcion = ball.descripcion?.trim() || 'Sin descripción disponible.';

    const created = await prisma.ball.create({
      data: {
        name: ball.name,
        nombre: ball.nombre ?? ball.name,
        type: ball.type,
        tipo: ball.tipo ?? 'pura',
        level: ball.level ?? 1,
        description: descripcion,
        descripcion,
        imageUrl: `/images/${imageSlug}.png`
      }
    });

    ballIds.set(created.name, created.id);
  }

  for (const { fusionName, seed } of preparedFusions) {
    const inputIds = seed.comb
      .map((name) => ballIds.get(name))
      .filter((id): id is number => id !== undefined);

    if (inputIds.length !== seed.comb.length) {
      console.warn(`⚠️  No se encontraron todas las bolas para la fusión ${fusionName}`);
      continue;
    }

    const resultId = ballIds.get(fusionName);
    if (!resultId) {
      console.warn(`⚠️  No se encontró la bola resultado para ${fusionName}`);
      continue;
    }

    const recipe = await prisma.fusionRecipe.create({
      data: {
        requiredLevel: seed.requiredLevel ?? 3,
        origenA: seed.origenA ?? seed.comb[0] ?? null,
        origenB:
          seed.origenB ??
          (seed.comb.length > 1 ? seed.comb.slice(1).join(' + ') : null),
        resultado: seed.resultado ?? seed.result,
        descripcion: seed.descripcion ?? null,
        emoji: seed.emoji ?? null,
        tipo: 'fusion',
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

  for (const { evolutionName, seed } of preparedEvolutions) {
    const componentIds = seed.comb
      .map((name) => ballIds.get(name))
      .filter((id): id is number => id !== undefined);

    if (componentIds.length !== seed.comb.length) {
      console.warn(`⚠️  No se encontraron todos los componentes para la evolución ${evolutionName}`);
      continue;
    }

    const resultId = ballIds.get(evolutionName);
    if (!resultId) {
      console.warn(`⚠️  No se encontró la bola evolucionada para ${evolutionName}`);
      continue;
    }

    const evolution = await prisma.evolution.create({
      data: {
        requiredLevel: (seed.requiredLevel ?? 3) + 1,
        descripcion: seed.descripcion ?? null,
        emoji: seed.emoji ?? null,
        tipo: 'evolucion',
        result: { connect: { id: resultId } }
      }
    });

    await prisma.evolutionComponent.createMany({
      data: componentIds.map((ballId) => ({
        evolutionId: evolution.id,
        ballId
      }))
    });
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
