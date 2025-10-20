import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

type BallType = 'pure' | 'evolution';

type BallSeed = {
  name: string;
  nombre?: string;
  description?: string;
  descripcion?: string;
  imageUrl?: string;
  type?: BallType;
};

type EvolutionSeed = {
  slug?: string;
  description?: string;
  descripcion?: string;
  base: string;
  result: string;
};

type CharacterSeed = {
  slug?: string;
  name_en: string;
  name_es: string;
  description_en?: string;
  description_es?: string;
  starting_ball_en?: string;
  starting_ball_es?: string;
  unlock_requirement_en?: string;
  unlock_requirement_es?: string;
  imageUrl?: string;
};

type ItemSeed = {
  slug?: string;
  name: string;
  nombre?: string;
  description?: string;
  descripcion?: string;
  imageUrl?: string;
  type?: string;
};

type PassiveSeed = {
  name_en: string;
  name_es: string;
  description_en?: string;
  description_es?: string;
  imageUrl?: string;
};

type PassiveEvolutionSeed = {
  components_en: string;
  components_es: string;
  result_en: string;
  result_es: string;
};

const prisma = new PrismaClient();
const dataDir = path.join(__dirname, 'data');

// ⚙️ Utilidades
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
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// 🌱 SEED PRINCIPAL
async function main() {
  console.log('🌱 Loading wiki seed data...');

  const balls = readJson<BallSeed[]>('balls.json');
  const evolutions = readJson<EvolutionSeed[]>('evolutions.json');
  const characters = readJson<CharacterSeed[]>('characters.json');
  const items = readJson<ItemSeed[]>('items.json');
  const passives = readJson<PassiveSeed[]>('passives.json');
  const passiveEvolutions = readJson<PassiveEvolutionSeed[]>('passivesEvolutions.json');

  // 🧹 Limpieza previa
  await prisma.evolution.deleteMany();
  await prisma.character.deleteMany();
  await prisma.item.deleteMany();
  await prisma.passiveEvolution.deleteMany();
  await prisma.passive.deleteMany();
  await prisma.ball.deleteMany();

  // 🪄 Crear bolas
  const ballIds = new Map<string, { id: number; slug: string; type: BallType }>();

  for (const ball of balls) {
    const slug = slugify(ball.name);
    const type: BallType = ball.type ?? 'pure';

    const created = await prisma.ball.create({
      data: {
        name: ball.name,
        nombre: ball.nombre ?? null,
        description: ball.description ?? null,
        descripcion: ball.descripcion ?? null,
        imageUrl: ball.imageUrl ?? null,
        slug,
        type,
        isPure: type === 'pure'
      }
    });

    ballIds.set(ball.name, { id: created.id, slug, type });
  }

  // ⚙️ Crear evoluciones
  for (const evolution of evolutions) {
    const baseBall = ballIds.get(evolution.base);
    const resultBall = ballIds.get(evolution.result);

    if (!baseBall || !resultBall) {
      console.warn(`⚠️  Evolution skipped because base "${evolution.base}" or result "${evolution.result}" was not found.`);
      continue;
    }

    const slug = evolution.slug ?? slugify(`${evolution.base}-to-${evolution.result}`);

    await prisma.evolution.create({
      data: {
        slug,
        description: evolution.description ?? null,
        descripcion: evolution.descripcion ?? null,
        baseBall: { connect: { id: baseBall.id } },
        resultBall: { connect: { id: resultBall.id } }
      }
    });

  }

  // 🧩 Crear personajes
  for (const character of characters) {
    const slug = character.slug ?? slugify(character.name_en);
    await prisma.character.create({
      data: {
        slug,
        nameEn: character.name_en,
        nameEs: character.name_es,
        descriptionEn: character.description_en ?? null,
        descriptionEs: character.description_es ?? null,
        startingBallEn: character.starting_ball_en ?? null,
        startingBallEs: character.starting_ball_es ?? null,
        unlockRequirementEn: character.unlock_requirement_en ?? null,
        unlockRequirementEs: character.unlock_requirement_es ?? null,
        imageUrl: character.imageUrl ?? null
      }
    });
  }

  // 🪄 Crear items
  for (const item of items) {
    const slug = item.slug ?? slugify(item.name);
    await prisma.item.create({
      data: {
        slug,
        name: item.name,
        nombre: item.nombre ?? null,
        description: item.description ?? null,
        descripcion: item.descripcion ?? null,
        imageUrl: item.imageUrl ?? null,
        type: item.type ?? null
      }
    });
  }

  // 🧿 Crear pasivas
  for (const passive of passives) {
    await prisma.passive.create({
      data: {
        name_en: passive.name_en,
        name_es: passive.name_es,
        description_en: passive.description_en ?? null,
        description_es: passive.description_es ?? null,
        imageUrl: passive.imageUrl ?? null
      }
    });
  }

  // 🧠 Crear evoluciones de pasivas
  for (const evolution of passiveEvolutions) {
    await prisma.passiveEvolution.create({
      data: {
        components_en: evolution.components_en,
        components_es: evolution.components_es,
        result_en: evolution.result_en,
        result_es: evolution.result_es
      }
    });
  }

  console.log('✅ Wiki seed data loaded successfully.');
}

// 🧹 Manejo de errores
main()
  .catch((error) => {
    console.error('❌ Error while seeding database', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });