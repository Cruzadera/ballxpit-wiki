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

  await prisma.character.deleteMany();
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

  await prisma.character.createMany({
    data: [
      {
        slug: 'el-guerrero',
        name_es: 'El Guerrero',
        name_en: 'The Warrior',
        short_es: 'Un guerrero errante.',
        short_en: 'A wandering warrior.',
        description_es: 'Personaje por defecto, sin rasgos especiales.',
        description_en: 'Default character, with no special traits.',
        ball: 'Sangrado / Bleed',
        trait_es: 'N/A',
        trait_en: 'N/A'
      },
      {
        slug: 'el-dedo-inquieto',
        name_es: 'El Dedo Inquieto',
        name_en: 'The Itchy Finger',
        short_es: 'Un ayudante deshonrado.',
        short_en: 'A disgraced assistant.',
        description_es:
          'Dispara el doble de rápido y lanza bolas constantemente mientras haya disponibles.',
        description_en: 'Shoots twice as fast and constantly fires while balls remain.',
        ball: 'Fuego / Fire',
        trait_es: 'Velocidad de disparo doble',
        trait_en: 'Double fire rate'
      },
      {
        slug: 'el-arrepentido',
        name_es: 'El Arrepentido',
        name_en: 'The Repentant',
        short_es: 'Un ser lleno de remordimiento.',
        short_en: 'A being full of remorse.',
        description_es:
          'Cada rebote aumenta el daño un 5 %; las bolas que tocan el fondo regresan dañando a los enemigos.',
        description_en:
          'Each bounce increases damage by 5%; balls touching the floor return damaging enemies.',
        ball: 'Hielo / Ice',
        trait_es: 'Daño progresivo por rebote',
        trait_en: 'Damage increases per bounce'
      },
      {
        slug: 'los-convivientes',
        name_es: 'Los Convivientes',
        name_en: 'The Cohabitants',
        short_es: 'Una pareja con muchos hijos.',
        short_en: 'A couple with many children.',
        description_es:
          'Cada disparo lanza una copia en dirección opuesta, con mitad de daño.',
        description_en:
          'Each shot fires a mirrored copy dealing half damage.',
        ball: 'Madre Progenitora / Mother Brood',
        trait_es: 'Disparo doble en espejo',
        trait_en: 'Mirrored dual shots'
      },
      {
        slug: 'el-cogitador',
        name_es: 'El Cogitador',
        name_en: 'The Cogitator',
        short_es: 'Un filósofo brillante, perdido en sus pensamientos.',
        short_en: 'A bright philosopher, lost in thought.',
        description_es: 'Elige mejoras automáticamente.',
        description_en: 'Automatically selects upgrades.',
        ball: 'Láser vertical / Vertical Laser',
        trait_es: 'Elección automática de mejoras',
        trait_en: 'Auto-upgrade selection'
      },
      {
        slug: 'el-incrustado',
        name_es: 'El Incrustado',
        name_en: 'The Embedded',
        short_es: 'Marcado por mil batallas.',
        short_en: 'Scarred by a thousand battles.',
        description_es:
          'Las bolas atraviesan enemigos hasta chocar con una pared.',
        description_en: 'Balls pierce through enemies until hitting a wall.',
        ball: 'Veneno / Poison',
        trait_es: 'Disparo penetrante',
        trait_en: 'Piercing shots'
      },
      {
        slug: 'el-exnido',
        name_es: 'El Exnido',
        name_en: 'The Empty Nester',
        short_es: 'Por fin, algo de paz y silencio.',
        short_en: 'Finally, some peace and quiet.',
        description_es:
          'Dispara múltiples instancias de una bola especial, sin bolas bebé.',
        description_en: 'Fires multiple instances of a special ball without baby balls.',
        ball: 'Fantasma / Ghost',
        trait_es: 'Múltiples disparos especiales',
        trait_en: 'Multiple special shots'
      },
      {
        slug: 'la-sombra',
        name_es: 'La Sombra',
        name_en: 'The Shade',
        short_es: 'Un asesino a sueldo.',
        short_en: 'A hired assassin.',
        description_es: 'Dispara desde atrás con 10 % de probabilidad de crítico.',
        description_en: 'Shoots from behind with 10% critical chance.',
        ball: 'Oscuridad / Darkness',
        trait_es: 'Críticos aleatorios',
        trait_en: 'Random critical hits'
      },
      {
        slug: 'el-portador-del-escudo',
        name_es: 'El Portador del Escudo',
        name_en: 'The Shieldbearer',
        short_es: 'La primera línea de defensa.',
        short_en: 'The first line of defense.',
        description_es:
          'Rebota bolas con su escudo, duplicando su daño en cada rebote.',
        description_en: 'Reflects balls with his shield, doubling damage per bounce.',
        ball: 'Hierro / Iron',
        trait_es: 'Daño duplicado por rebote',
        trait_en: 'Double damage on bounce'
      },
      {
        slug: 'el-derrochador',
        name_es: 'El Derrochador',
        name_en: 'The Spendthrift',
        short_es: 'Un mercader rico y extravagante.',
        short_en: 'A wealthy, extravagant merchant.',
        description_es: 'Dispara todas las bolas a la vez en un arco amplio.',
        description_en: 'Fires all balls at once in a wide arc.',
        ball: 'Vampiro / Vampire',
        trait_es: 'Disparo múltiple instantáneo',
        trait_en: 'Instant multi-shot'
      },
      {
        slug: 'el-flagelante',
        name_es: 'El Flagelante',
        name_en: 'The Flagellant',
        short_es: 'Un penitente común.',
        short_en: 'A humble penitent.',
        description_es:
          'Las bolas rebotan normalmente en la parte inferior de la pantalla.',
        description_en: 'Balls bounce normally off the bottom of the screen.',
        ball: 'Saco de Huevos / Egg Sack',
        trait_es: 'Rebote inferior activo',
        trait_en: 'Active bottom bounce'
      },
      {
        slug: 'el-malabarista',
        name_es: 'El Malabarista',
        name_en: 'The Juggler',
        short_es: 'Artista callejero, maestro del espectáculo.',
        short_en: 'Street performer, master of showmanship.',
        description_es:
          'Lanza bolas en parábola hasta un punto objetivo; empiezan a rebotar al tocar el suelo.',
        description_en:
          'Throws balls in a parabola to a target; they bounce upon hitting the ground.',
        ball: 'Relámpago / Lightning',
        trait_es: 'Lanzamiento parabólico',
        trait_en: 'Parabolic throw'
      },
      {
        slug: 'el-tactico',
        name_es: 'El Táctico',
        name_en: 'The Tactician',
        short_es: 'Un general retirado, con experiencia infinita.',
        short_en: 'A retired general with infinite experience.',
        description_es: 'Convierte las batallas en combates por turnos.',
        description_en: 'Turns battles into turn-based combat.',
        ball: 'Hierro / Iron',
        trait_es: 'Combate táctico',
        trait_en: 'Tactical combat'
      },
      {
        slug: 'el-radical',
        name_es: 'El Radical',
        name_en: 'The Radical',
        short_es: 'Radicalizado por años de soledad.',
        short_en: 'Radicalized by years of solitude.',
        description_es: 'Juega y elige mejoras automáticamente.',
        description_en: 'Plays and selects upgrades automatically.',
        ball: 'Viento / Wind',
        trait_es: 'Juego automatizado',
        trait_en: 'Automated play'
      },
      {
        slug: 'el-fisico',
        name_es: 'El Físico',
        name_en: 'The Physicist',
        short_es: 'Un pionero de la ciencia.',
        short_en: 'A pioneer of science.',
        description_es:
          'Las bolas son afectadas por la gravedad hacia el fondo de la pantalla.',
        description_en: 'Balls are affected by gravity toward the bottom of the screen.',
        ball: 'Luz / Light',
        trait_es: 'Física gravitacional',
        trait_en: 'Gravity physics'
      }
    ]
  });

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
