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
  'Holy Lazer',
  'Sacred Laser',
  'Cornucopia',
  'Soul Reaper',
  'Sharpshooter’s Crossbow'
]);

const forcedFusionNames = new Set<string>(['Hemorrhage', 'Inferno', 'Blizzard', 'Sun', 'Overgrowth', 'Noxious']);

const ballNameAliases: Record<string, string> = {
  Fire: 'Burn',
  Frenzy: 'Berserk',
  Larva: 'Maggot',
  Laser: 'Laser (H/V)',
  'Radioactive Beam': 'Radiation Beam',
  Enamored: 'Lovestruck',
  Apparition: 'Phantom',
  Scattershot: 'Shotgun',
  'Ice Ray': 'Freeze Ray',
  'Sacred Laser': 'Holy Lazer'
};

const officialBallSeeds: BallSeed[] = [
  {
    name: 'Bleed',
    nombre: 'Sangrado',
    description: 'Inflicts bleed stacks; each stack deals damage when you hit the enemy.',
    descripcion: 'Inflige pilas de sangrado; cada pila hace daño cuando golpeas al enemigo.',
    type: 'pure'
  },
  {
    name: 'Brood Mother',
    nombre: 'Madre Cría',
    description: 'Has a chance to spawn a baby ball whenever it hits an enemy.',
    descripcion: 'Tiene cierta probabilidad de generar una bola bebé al golpear al enemigo.',
    type: 'pure'
  },
  {
    name: 'Burn',
    nombre: 'Quemadura',
    description: 'Applies a stack of burn on impact; burning enemies take damage over time.',
    descripcion: 'Aplica una pila de quemadura al impactar; los enemigos quemados reciben daño con el tiempo.',
    type: 'pure'
  },
  {
    name: 'Cell',
    nombre: 'Célula',
    description: 'Divides and clones itself multiple times after hitting an enemy.',
    descripcion: 'Se divide y clona varias veces después de golpear a un enemigo.',
    type: 'pure'
  },
  {
    name: 'Charm',
    nombre: 'Encanto',
    description: 'Has a chance to charm enemies, forcing them to attack others.',
    descripcion: 'Tiene una probabilidad de encantar a los enemigos, obligándolos a atacar a otros.',
    type: 'pure'
  },
  {
    name: 'Dark',
    nombre: 'Oscura',
    description: 'Deals high damage but destroys itself on impact and requires a cooldown.',
    descripcion: 'Inflige mucho daño pero se destruye al impactar y requiere enfriamiento.',
    type: 'pure'
  },
  {
    name: 'Earthquake',
    nombre: 'Terremoto',
    description: 'Deals area damage around the impact point.',
    descripcion: 'Causa daño en un área cercana al punto de impacto.',
    type: 'pure'
  },
  {
    name: 'Egg Sack',
    nombre: 'Saco de Huevos',
    description: 'Explodes into two to four baby balls on impact.',
    descripcion: 'Explota en dos a cuatro bolas bebé al impactar.',
    type: 'pure'
  },
  {
    name: 'Freeze',
    nombre: 'Congelación',
    description: 'Temporarily freezes enemies, making them take increased damage.',
    descripcion: 'Congela temporalmente a los enemigos, quienes reciben más daño.',
    type: 'pure'
  },
  {
    name: 'Ghost',
    nombre: 'Fantasma',
    description: 'Passes through enemies without stopping.',
    descripcion: 'Atraviesa a los enemigos sin detenerse.',
    type: 'pure'
  },
  {
    name: 'Iron',
    nombre: 'Hierro',
    description: 'Deals double damage but travels more slowly.',
    descripcion: 'Inflige el doble de daño pero viaja más lentamente.',
    type: 'pure'
  },
  {
    name: 'Laser (H/V)',
    nombre: 'Láser (H/V)',
    description: 'Strikes every enemy aligned horizontally or vertically.',
    descripcion: 'Golpea a todos los enemigos alineados en fila o columna.',
    type: 'pure'
  },
  {
    name: 'Light',
    nombre: 'Luz',
    description: 'Blinds enemies on hit; blinded enemies can miss their attacks.',
    descripcion: 'Ciega a los enemigos al golpear; los cegados pueden fallar sus ataques.',
    type: 'pure'
  },
  {
    name: 'Lightning',
    nombre: 'Rayo',
    description: 'Chains lightning to multiple nearby enemies.',
    descripcion: 'Encadena rayos hacia varios enemigos cercanos.',
    type: 'pure'
  },
  {
    name: 'Poison',
    nombre: 'Veneno',
    description: 'Applies poison that deals damage over time.',
    descripcion: 'Aplica veneno que inflige daño con el tiempo.',
    type: 'pure'
  },
  {
    name: 'Vampire',
    nombre: 'Vampiro',
    description: 'Successful hits have a chance to heal you.',
    descripcion: 'Los golpes acertados tienen probabilidad de curarte.',
    type: 'pure'
  },
  {
    name: 'Wind',
    nombre: 'Viento',
    description: 'Pierces through enemies and slows them by 30%.',
    descripcion: 'Atraviesa a los enemigos y los ralentiza un 30%.',
    type: 'pure'
  },
  {
    name: 'Leech',
    nombre: 'Sanguijuela',
    description: 'Draws vitality from every target struck.',
    descripcion: 'Extrae vitalidad de cada objetivo golpeado.',
    type: 'evolution'
  },
  {
    name: 'Berserk',
    nombre: 'Furia',
    description: 'Unleashes uncontrollable rage that increases attack speed.',
    descripcion: 'Desata una furia incontrolable que aumenta la velocidad de ataque.',
    type: 'evolution'
  },
  {
    name: 'Sacrifice',
    nombre: 'Sacrificio',
    description: 'Destroys itself to empower allies or trigger devastation.',
    descripcion: 'Se destruye a sí misma para potenciar aliados o causar devastación.',
    type: 'evolution'
  },
  {
    name: 'Hemorrhage',
    nombre: 'Hemorragia',
    description: 'Causes enemies to bleed continuously.',
    descripcion: 'Hace que los enemigos sangren de forma continua.',
    type: 'evolution'
  },
  {
    name: 'Vampire Lord',
    nombre: 'Señor Vampiro',
    description: 'Apex form of the vampire, commanding darkness itself.',
    descripcion: 'Forma suprema del vampiro, que domina la oscuridad.',
    type: 'evolution'
  },
  {
    name: 'Maggot',
    nombre: 'Gusano',
    description: 'Larval form that consumes decayed life.',
    descripcion: 'Forma larval que devora vida en descomposición.',
    type: 'evolution'
  },
  {
    name: 'Spider Queen',
    nombre: 'Reina Araña',
    description: 'Matriarch of webs and predators.',
    descripcion: 'Matriarca de telarañas y depredadores.',
    type: 'evolution'
  },
  {
    name: 'Mosquito King',
    nombre: 'Rey Mosquito',
    description: 'Sovereign of bloodthirsty swarms.',
    descripcion: 'Soberano de los enjambres sedientos de sangre.',
    type: 'evolution'
  },
  {
    name: 'Magma',
    nombre: 'Magma',
    description: 'Fusion of fire and earth in a molten core.',
    descripcion: 'Fusión de fuego y tierra en un núcleo fundido.',
    type: 'evolution'
  },
  {
    name: 'Frozen Flame',
    nombre: 'Llama Helada',
    description: 'Perfect balance of frost and flame.',
    descripcion: 'Equilibrio perfecto entre escarcha y fuego.',
    type: 'evolution'
  },
  {
    name: 'Bomb',
    nombre: 'Bomba',
    description: 'Explodes violently, damaging everything nearby.',
    descripcion: 'Explota violentamente, dañando todo lo cercano.',
    type: 'evolution'
  },
  {
    name: 'Sun',
    nombre: 'Sol',
    description: 'Radiates life and destruction in equal measure.',
    descripcion: 'Irradia vida y destrucción a partes iguales.',
    type: 'evolution'
  },
  {
    name: 'Inferno',
    nombre: 'Infierno',
    description: 'Endless burning storm that consumes everything.',
    descripcion: 'Tormenta ardiente que lo consume todo.',
    type: 'evolution'
  },
  {
    name: 'Overgrowth',
    nombre: 'Sobrecrecimiento',
    description: 'Spreads uncontrollably, overwhelming its host.',
    descripcion: 'Se propaga sin control, desbordando su huésped.',
    type: 'evolution'
  },
  {
    name: 'Radiation Beam',
    nombre: 'Rayo Radiactivo',
    description: 'Emits lethal waves of unstable energy.',
    descripcion: 'Emite ondas letales de energía inestable.',
    type: 'evolution'
  },
  {
    name: 'Virus',
    nombre: 'Virus',
    description: 'Infectious creation that multiplies rapidly.',
    descripcion: 'Creación infecciosa que se multiplica rápidamente.',
    type: 'evolution'
  },
  {
    name: 'Incubus',
    nombre: 'Íncubo',
    description: 'Male demon orb that corrupts others with temptation.',
    descripcion: 'Esfera demoníaca masculina que corrompe mediante la tentación.',
    type: 'evolution'
  },
  {
    name: 'Lovestruck',
    nombre: 'Enamorado',
    description: 'Fights passionately, ignoring pain and logic.',
    descripcion: 'Lucha con pasión, ignorando el dolor y la lógica.',
    type: 'evolution'
  },
  {
    name: 'Succubus',
    nombre: 'Súcubo',
    description: 'Seductive and deadly embodiment of charm.',
    descripcion: 'Encarnación seductora y mortal del encanto.',
    type: 'evolution'
  },
  {
    name: 'Phantom',
    nombre: 'Fantasma',
    description: 'Manifestation of restless spirits.',
    descripcion: 'Manifestación de espíritus inquietos.',
    type: 'evolution'
  },
  {
    name: 'Assassin',
    nombre: 'Asesino',
    description: 'Strikes with deadly precision from the shadows.',
    descripcion: 'Ataca con precisión letal desde las sombras.',
    type: 'evolution'
  },
  {
    name: 'Flicker',
    nombre: 'Destello',
    description: 'Brief spark between light and darkness.',
    descripcion: 'Breve chispa entre la luz y la oscuridad.',
    type: 'evolution'
  },
  {
    name: 'Noxious',
    nombre: 'Nocivo',
    description: 'Pollutes the air and weakens nearby foes.',
    descripcion: 'Contamina el aire y debilita a los enemigos cercanos.',
    type: 'evolution'
  },
  {
    name: 'Glacier',
    nombre: 'Glaciar',
    description: 'Colossal wall of ancient ice.',
    descripcion: 'Colosal muro de hielo ancestral.',
    type: 'evolution'
  },
  {
    name: 'Swamp',
    nombre: 'Pantano',
    description: 'A bog of decay and toxic life.',
    descripcion: 'Un pantano de descomposición y vida tóxica.',
    type: 'evolution'
  },
  {
    name: 'Sandstorm',
    nombre: 'Tormenta de Arena',
    description: 'Obscures vision and erodes all that stands in its path.',
    descripcion: 'Oscurece la visión y erosiona todo a su paso.',
    type: 'evolution'
  },
  {
    name: 'Shotgun',
    nombre: 'Escopeta',
    description: 'Fires multiple fragments in a wide spread.',
    descripcion: 'Dispara múltiples fragmentos en un amplio rango.',
    type: 'evolution'
  },
  {
    name: 'Mosquito Swarm',
    nombre: 'Enjambre de Mosquitos',
    description: 'Summons bloodsucking hordes to drain vitality.',
    descripcion: 'Invoca hordas chupasangre para drenar vitalidad.',
    type: 'evolution'
  },
  {
    name: 'Wraith',
    nombre: 'Espectro',
    description: 'A cursed soul bound to eternal vengeance.',
    descripcion: 'Un alma maldita ligada a la venganza eterna.',
    type: 'evolution'
  },
  {
    name: 'Freeze Ray',
    nombre: 'Rayo Congelante',
    description: 'Emits concentrated cold that freezes targets instantly.',
    descripcion: 'Emite frío concentrado que congela instantáneamente.',
    type: 'evolution'
  },
  {
    name: 'Blizzard',
    nombre: 'Ventisca',
    description: 'Freezing storm that immobilizes everything.',
    descripcion: 'Tormenta helada que inmoviliza todo.',
    type: 'evolution'
  },
  {
    name: 'Lightning Rod',
    nombre: 'Pararrayos',
    description: 'Channels electric fury through itself.',
    descripcion: 'Canaliza furia eléctrica a través de sí misma.',
    type: 'evolution'
  },
  {
    name: 'Laser Beam',
    nombre: 'Rayo Láser',
    description: 'A perfect line of focused destruction.',
    descripcion: 'Línea perfecta de destrucción concentrada.',
    type: 'evolution'
  },
  {
    name: 'Flash',
    nombre: 'Destello',
    description: 'Momentary burst of pure light energy.',
    descripcion: 'Estallido momentáneo de pura energía lumínica.',
    type: 'evolution'
  },
  {
    name: 'Storm',
    nombre: 'Tormenta',
    description: 'Uncontrollable surge of elemental power.',
    descripcion: 'Oleada incontrolable de poder elemental.',
    type: 'evolution'
  },
  {
    name: 'Nuclear Bomb',
    nombre: 'Bomba Nuclear',
    description: 'Ultimate destructive fusion of fire and poison.',
    descripcion: 'Fusión destructiva suprema de fuego y veneno.',
    type: 'evolution'
  },
  {
    name: 'Voluptuous Egg Sac',
    nombre: 'Saco de Huevos Voluptuoso',
    description: 'Massive nest filled with pulsating life.',
    descripcion: 'Nido masivo lleno de vida palpitante.',
    type: 'evolution'
  },
  {
    name: 'Black Hole',
    nombre: 'Agujero Negro',
    description: 'Absorbs everything into eternal void.',
    descripcion: 'Absorbe todo en el vacío eterno.',
    type: 'evolution'
  },
  {
    name: 'Satan',
    nombre: 'Satán',
    description: 'Combination of temptation and darkness made flesh.',
    descripcion: 'Combinación de tentación y oscuridad hecha carne.',
    type: 'evolution'
  },
  {
    name: 'Nosferatu',
    nombre: 'Nosferatu',
    description: 'Ultimate vampiric evolution, ruler of night.',
    descripcion: 'Evolución vampírica definitiva, soberano de la noche.',
    type: 'evolution'
  },
  {
    name: 'Holy Lazer',
    nombre: 'Láser Sagrado',
    description: 'Purifies all it touches with divine energy.',
    descripcion: 'Purifica todo lo que toca con energía divina.',
    type: 'evolution'
  }
];

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

function applyBallAliases(ballIds: Map<string, { id: number; slug: string; type: BallType }>) {
  for (const [legacyName, canonicalName] of Object.entries(ballNameAliases)) {
    const canonical = ballIds.get(canonicalName);
    if (canonical) {
      ballIds.set(legacyName, canonical);
    }
  }
}

async function main() {
  console.log('🌱 Loading wiki seed data...');

  console.log('🧹 Clearing database before seeding...');
  await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF;`);
  await prisma.evolution.deleteMany();
  await prisma.fusionComponent.deleteMany();
  await prisma.fusion.deleteMany();
  await prisma.character.deleteMany();
  await prisma.item.deleteMany();
  await prisma.passiveEvolution.deleteMany();
  await prisma.passive.deleteMany();
  await prisma.ball.deleteMany();
  await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);
  console.log('✅ Database cleared successfully.');

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

  applyBallAliases(ballIds);

  for (const officialBall of officialBallSeeds) {
    if (ballIds.has(officialBall.name)) {
      continue;
    }

    const slug = slugify(officialBall.name);
    const type =
      officialBall.type && (officialBall.type === 'pure' || officialBall.type === 'fusion' || officialBall.type === 'evolution')
        ? (officialBall.type as BallType)
        : 'pure';

    const created = await prisma.ball.create({
      data: {
        name: officialBall.name,
        nombre: officialBall.nombre ?? null,
        description: officialBall.description ?? null,
        descripcion: officialBall.descripcion ?? null,
        imageUrl: officialBall.imageUrl ?? null,
        slug,
        type,
        isPure: type === 'pure'
      }
    });

    ballIds.set(officialBall.name, { id: created.id, slug, type });
    ensureUsage(usageCounter, slug);
  }

  applyBallAliases(ballIds);

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

    try {
      await prisma.evolution.create({
        data: {
          slug,
          description: evolution.description ?? null,
          descripcion: evolution.descripcion ?? null,
          baseBall: { connect: { id: baseBall.id } },
          resultBall: { connect: { id: resultBall.id } }
        }
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        console.warn(`⚠️ Evolution with slug "${slug}" already exists, skipping...`);
        continue;
      }
      throw err;
    }

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
