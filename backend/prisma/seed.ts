import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

type BallType = 'pure' | 'fusion' | 'evolution';

type BallSeed = {
  name: string;
  nombre?: string;
  description?: string;
  descripcion?: string;
  imageUrl?: string;
  type?: BallType;
};

type FusionSeed = {
  slug?: string;
  description?: string;
  descripcion?: string;
  result: string;
  components: string[];
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

const forcedEvolutionNames = new Set<string>([
  'Vampire Lord',
  'Spider Queen',
  'Nosferatu',
  'Satan',
  'Black Hole',
  'Sacred Laser',
  'Cornucopia',
  'Soul Reaper',
  'Sharpshooter’s Crossbow'
]);

const forcedFusionNames = new Set<string>(['Hemorrhage', 'Inferno', 'Blizzard', 'Sun', 'Overgrowth', 'Noxious']);

const passiveSeeds: PassiveSeed[] = [
  { name_en: "Archer's Effigy", name_es: 'Efigie del Arquero' },
  { name_en: 'Artificial Heart', name_es: 'Corazón Artificial' },
  { name_en: 'Baby Rattle', name_es: 'Sonajero de Bebé' },
  { name_en: 'Bandage Roll', name_es: 'Venda Enrollada' },
  { name_en: 'Bottled Tornado', name_es: 'Tornado Embotellado' },
  { name_en: 'Breastplate', name_es: 'Coraza' },
  { name_en: 'Crown of Thorns', name_es: 'Corona de Espinas' },
  { name_en: 'Cursed Elixir', name_es: 'Elixir Maldito' },
  { name_en: "Deadeye's Amulet", name_es: 'Amuleto del Tirador' },
  { name_en: 'Diamond Hilted Dagger', name_es: 'Daga con Empuñadura de Diamante' },
  { name_en: 'Dynamite', name_es: 'Dinamita' },
  { name_en: 'Emerald Hilted Dagger', name_es: 'Daga con Empuñadura de Esmeralda' },
  { name_en: 'Ethereal Cloak', name_es: 'Capa Etérea' },
  { name_en: 'Everflowing Goblet', name_es: 'Cáliz Inagotable' },
  { name_en: 'Eye of the Beholder', name_es: 'Ojo del Observador' },
  { name_en: 'Fleet Feet', name_es: 'Pies Ligeros' },
  { name_en: 'Frozen Spike', name_es: 'Púa Congelada' },
  { name_en: 'Gemspring', name_es: 'Fuente de Gemas' },
  { name_en: 'Ghostly Corset', name_es: 'Corsé Fantasmal' },
  { name_en: 'Ghostly Shield', name_es: 'Escudo Fantasmal' },
  { name_en: 'Golden Bull', name_es: 'Toro Dorado' },
  { name_en: 'Hand Fan', name_es: 'Abanico' },
  { name_en: 'Hand Mirror', name_es: 'Espejo de Mano' },
  { name_en: "Healer's Effigy", name_es: 'Efigie del Sanador' },
  { name_en: 'Hourglass', name_es: 'Reloj de Arena' },
  { name_en: 'Kiss of Death', name_es: 'Beso de la Muerte' },
  { name_en: "Lover's Quiver", name_es: 'Carcaj del Amante' },
  { name_en: 'Magic Staff', name_es: 'Bastón Mágico' },
  { name_en: 'Magnet', name_es: 'Imán' },
  { name_en: 'Midnight Oil', name_es: 'Aceite de Medianoche' },
  { name_en: 'Pressure Valve', name_es: 'Válvula de Presión' },
  { name_en: 'Protective Charm', name_es: 'Amuleto Protector' },
  { name_en: 'Radiant Feather', name_es: 'Pluma Radiante' },
  { name_en: "Reacher's Spear", name_es: 'Lanza del Alcanzador' },
  { name_en: 'Rubber Headband', name_es: 'Cinta Elástica' },
  { name_en: 'Ruby Hilted Dagger', name_es: 'Daga con Empuñadura de Rubí' },
  { name_en: 'Sapphire Hilted Dagger', name_es: 'Daga con Empuñadura de Zafiro' },
  { name_en: 'Shortbow', name_es: 'Arco Corto' },
  { name_en: 'Silver Blindfold', name_es: 'Venda Plateada' },
  { name_en: 'Silver Bullet', name_es: 'Bala de Plata' },
  { name_en: 'Slingshot', name_es: 'Hondera' },
  { name_en: 'Spiked Collar', name_es: 'Collar con Púas' },
  { name_en: 'Stone Effigy', name_es: 'Efigie de Piedra' },
  { name_en: "Traitor's Cowl", name_es: 'Capucha del Traidor' },
  { name_en: 'Turret', name_es: 'Torreta' },
  { name_en: 'Upturned Hatchet', name_es: 'Hacha Invertida' },
  { name_en: 'Vampiric Sword', name_es: 'Espada Vampírica' },
  { name_en: 'Voodoo Doll', name_es: 'Muñeco Vudú' },
  { name_en: 'Wagon Wheel', name_es: 'Rueda de Carro' },
  { name_en: 'War Horn', name_es: 'Cuerno de Guerra' },
  { name_en: 'Wretched Onion', name_es: 'Cebolla Miserable' }
];

const passiveEvolutionSeeds: PassiveEvolutionSeed[] = [
  {
    components_en: 'Baby Rattle + War Horn',
    components_es: 'Sonajero de Bebé + Cuerno de Guerra',
    result_en: 'Cornucopia',
    result_es: 'Cornucopia'
  },
  {
    components_en: "Reacher's Spear + Deadeye's Amulet",
    components_es: 'Lanza del Alcanzador + Amuleto del Tirador',
    result_en: 'Gracious Impaler',
    result_es: 'Empalador Gracioso'
  },
  {
    components_en: 'Breastplate + Wretched Onion',
    components_es: 'Coraza + Cebolla Miserable',
    result_en: 'Odiferous Shell',
    result_es: 'Caparazón Fétido'
  },
  {
    components_en: 'Ethereal Cloak + Ghostly Corset',
    components_es: 'Capa Etérea + Corsé Fantasmal',
    result_en: 'Phantom Regalia',
    result_es: 'Regalia Fantasmal'
  },
  {
    components_en: 'Everflowing Goblet + Vampiric Sword',
    components_es: 'Cáliz Inagotable + Espada Vampírica',
    result_en: 'Soul Reaver',
    result_es: 'Segador de Almas'
  },
  {
    components_en: 'Crown of Thorns + Spiked Collar',
    components_es: 'Corona de Espinas + Collar con Púas',
    result_en: "Tormentor's Mask",
    result_es: 'Máscara del Torturador'
  },
  {
    components_en: 'Fleet Feet + Radiant Feather',
    components_es: 'Pies Ligeros + Pluma Radiante',
    result_en: 'Wings of the Anointed',
    result_es: 'Alas de los Ungidos'
  },
  {
    components_en:
      'Diamond Hilted Dagger + Emerald Hilted Dagger + Ruby Hilted Dagger + Sapphire Hilted Dagger',
    components_es:
      'Daga con Empuñadura de Diamante + Daga con Empuñadura de Esmeralda + Daga con Empuñadura de Rubí + Daga con Empuñadura de Zafiro',
    result_en: "Deadeye's Cross",
    result_es: 'Cruz del Tirador'
  }
];

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

type UsageCounter = {
  fusionResults: number;
  fusionComponents: number;
  evolutionBase: number;
  evolutionResult: number;
};

function ensureUsage(map: Map<string, UsageCounter>, slug: string): UsageCounter {
  const current = map.get(slug);
  if (current) {
    return current;
  }

  const usage: UsageCounter = {
    fusionResults: 0,
    fusionComponents: 0,
    evolutionBase: 0,
    evolutionResult: 0
  };
  map.set(slug, usage);
  return usage;
}

async function main() {
  console.log('🌱 Loading wiki seed data...');

  const balls = readJson<BallSeed[]>('balls.json');
  const fusions = readJson<FusionSeed[]>('fusions.json');
  const evolutions = readJson<EvolutionSeed[]>('evolutions.json');
  const characters = readJson<CharacterSeed[]>('characters.json');
  const items = readJson<ItemSeed[]>('items.json');

  await prisma.fusionComponent.deleteMany();
  await prisma.fusion.deleteMany();
  await prisma.evolution.deleteMany();
  await prisma.character.deleteMany();
  await prisma.item.deleteMany();
  await prisma.passiveEvolution.deleteMany();
  await prisma.passive.deleteMany();
  await prisma.ball.deleteMany();

  const fusionResults = new Set(fusions.map((fusion) => fusion.result));
  const evolutionResults = new Set(evolutions.map((evolution) => evolution.result));

  const ballIds = new Map<string, { id: number; slug: string; type: BallType }>();
  const usageCounter = new Map<string, UsageCounter>();

  for (const ball of balls) {
    const slug = slugify(ball.name);
    let type: BallType = 'pure';

    if (ball.type && (ball.type === 'pure' || ball.type === 'fusion' || ball.type === 'evolution')) {
      type = ball.type;
    } else if (forcedEvolutionNames.has(ball.name)) {
      type = 'evolution';
    } else if (forcedFusionNames.has(ball.name)) {
      type = 'fusion';
    } else if (evolutionResults.has(ball.name)) {
      type = 'evolution';
    } else if (fusionResults.has(ball.name)) {
      type = 'fusion';
    }

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
    ensureUsage(usageCounter, slug);
  }

  for (const fusion of fusions) {
    const resultBall = ballIds.get(fusion.result);
    if (!resultBall) {
      console.warn(`⚠️  Fusion result ball "${fusion.result}" not found.`);
      continue;
    }

    const slug = fusion.slug ?? slugify(`${fusion.components.join('-')}-${fusion.result}`);
    const created = await prisma.fusion.create({
      data: {
        slug,
        description: fusion.description ?? null,
        descripcion: fusion.descripcion ?? null,
        result: { connect: { id: resultBall.id } }
      }
    });

    ensureUsage(usageCounter, resultBall.slug).fusionResults++;

    for (const componentName of fusion.components) {
      const component = ballIds.get(componentName);
      if (!component) {
        console.warn(`⚠️  Fusion component "${componentName}" not found for ${fusion.result}.`);
        continue;
      }

      await prisma.fusionComponent.create({
        data: {
          fusionId: created.id,
          ballId: component.id
        }
      });

      ensureUsage(usageCounter, component.slug).fusionComponents++;
    }
  }

  for (const evolution of evolutions) {
    const baseBall = ballIds.get(evolution.base);
    const resultBall = ballIds.get(evolution.result);

    if (!baseBall || !resultBall) {
      console.warn(
        `⚠️  Evolution skipped because base "${evolution.base}" or result "${evolution.result}" was not found.`
      );
      continue;
    }

    if (resultBall.type !== 'evolution') {
      console.warn(
        `⚠️  Evolution skipped because result "${evolution.result}" is classified as "${resultBall.type}" instead of "evolution".`
      );
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

    ensureUsage(usageCounter, baseBall.slug).evolutionBase++;
    ensureUsage(usageCounter, resultBall.slug).evolutionResult++;
  }

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

  for (const passive of passiveSeeds) {
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

  for (const evolution of passiveEvolutionSeeds) {
    await prisma.passiveEvolution.create({
      data: {
        components_en: evolution.components_en,
        components_es: evolution.components_es,
        result_en: evolution.result_en,
        result_es: evolution.result_es
      }
    });
  }

  console.log('✅ Wiki seed data loaded.');
}

main()
  .catch((error) => {
    console.error('❌ Error while seeding database', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
