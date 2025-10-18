import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.fusionInput.deleteMany();
  await prisma.fusionRecipe.deleteMany();
  await prisma.evolution.deleteMany();
  await prisma.ball.deleteMany();

  const balls = [
    {
      name: 'Burn',
      type: 'Fire',
      level: 5,
      description: 'A volatile ember ready to ignite.',
      imageUrl: 'https://via.placeholder.com/128?text=Burn'
    },
    {
      name: 'Iron',
      type: 'Metal',
      level: 4,
      description: 'Sturdy and unyielding metal sphere.',
      imageUrl: 'https://via.placeholder.com/128?text=Iron'
    },
    {
      name: 'Bomb',
      type: 'Explosive',
      level: 12,
      description: 'An unstable orb primed to detonate.',
      imageUrl: 'https://via.placeholder.com/128?text=Bomb'
    },
    {
      name: 'Ghost',
      type: 'Spirit',
      level: 6,
      description: 'A translucent ball that phases through matter.',
      imageUrl: 'https://via.placeholder.com/128?text=Ghost'
    },
    {
      name: 'Freeze',
      type: 'Ice',
      level: 6,
      description: 'Chills anything it touches to the core.',
      imageUrl: 'https://via.placeholder.com/128?text=Freeze'
    },
    {
      name: 'Wrath',
      type: 'Spirit',
      level: 14,
      description: 'Manifested rage ready to be unleashed.',
      imageUrl: 'https://via.placeholder.com/128?text=Wrath'
    },
    {
      name: 'Poison',
      type: 'Toxic',
      level: 7,
      description: 'Seeps toxins into other balls on contact.',
      imageUrl: 'https://via.placeholder.com/128?text=Poison'
    },
    {
      name: 'Virus',
      type: 'Toxic',
      level: 15,
      description: 'Rapidly replicates inside unlucky opponents.',
      imageUrl: 'https://via.placeholder.com/128?text=Virus'
    },
    {
      name: 'Bleed',
      type: 'Dark',
      level: 8,
      description: 'Draws life force from every strike.',
      imageUrl: 'https://via.placeholder.com/128?text=Bleed'
    },
    {
      name: 'Brood Mother',
      type: 'Nature',
      level: 18,
      description: 'A hive mind orb that commands lesser spawn.',
      imageUrl: 'https://via.placeholder.com/128?text=Brood+Mother'
    },
    {
      name: 'Leech',
      type: 'Dark',
      level: 16,
      description: 'Feeds on lingering vitality to grow stronger.',
      imageUrl: 'https://via.placeholder.com/128?text=Leech'
    },
    {
      name: 'Ember',
      type: 'Fire',
      level: 10,
      description: 'A glowing coal that signals greater flames.',
      imageUrl: 'https://via.placeholder.com/128?text=Ember'
    },
    {
      name: 'Inferno',
      type: 'Fire',
      level: 20,
      description: 'A roaring wildfire contained in a sphere.',
      imageUrl: 'https://via.placeholder.com/128?text=Inferno'
    },
    {
      name: 'Wisp',
      type: 'Spirit',
      level: 9,
      description: 'Drifts silently, guiding allies in the dark.',
      imageUrl: 'https://via.placeholder.com/128?text=Wisp'
    },
    {
      name: 'Phantom',
      type: 'Spirit',
      level: 19,
      description: 'An ethereal menace made of pure intent.',
      imageUrl: 'https://via.placeholder.com/128?text=Phantom'
    }
  ];

  const createdBalls = new Map<string, number>();

  for (const ball of balls) {
    const created = await prisma.ball.create({
      data: ball
    });
    createdBalls.set(created.name, created.id);
  }

  const fusionRecipes = [
    {
      result: 'Bomb',
      requiredLevel: 10,
      inputs: ['Burn', 'Iron']
    },
    {
      result: 'Wrath',
      requiredLevel: 14,
      inputs: ['Ghost', 'Freeze']
    },
    {
      result: 'Virus',
      requiredLevel: 15,
      inputs: ['Ghost', 'Poison']
    },
    {
      result: 'Leech',
      requiredLevel: 16,
      inputs: ['Bleed', 'Brood Mother']
    }
  ];

  for (const recipe of fusionRecipes) {
    const resultId = createdBalls.get(recipe.result);
    if (!resultId) continue;

    await prisma.fusionRecipe.create({
      data: {
        requiredLevel: recipe.requiredLevel,
        resultId,
        inputs: {
          create: recipe.inputs
            .map((name) => createdBalls.get(name))
            .filter((id): id is number => Boolean(id))
            .map((ballId) => ({ ballId }))
        }
      }
    });
  }

  const evolutions = [
    { base: 'Burn', evolved: 'Ember', requiredLevel: 8 },
    { base: 'Ember', evolved: 'Inferno', requiredLevel: 18 },
    { base: 'Ghost', evolved: 'Wisp', requiredLevel: 9 },
    { base: 'Wisp', evolved: 'Phantom', requiredLevel: 17 },
    { base: 'Bleed', evolved: 'Leech', requiredLevel: 16 }
  ];

  for (const evo of evolutions) {
    const baseBallId = createdBalls.get(evo.base);
    const evolvedBallId = createdBalls.get(evo.evolved);

    if (!baseBallId || !evolvedBallId) continue;

    await prisma.evolution.create({
      data: {
        baseBallId,
        evolvedBallId,
        requiredLevel: evo.requiredLevel
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
