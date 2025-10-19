import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SupportedLanguage, translateField } from '../../common/i18n/language.util';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

@Injectable()
export class PassiveEvolutionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(language: SupportedLanguage) {
    const evolutions = await this.prisma.passiveEvolution.findMany({
      orderBy: { result_en: 'asc' }
    });

    return evolutions.map((evolution) => this.mapEvolution(evolution, language));
  }

  async findBySlug(slug: string, language: SupportedLanguage) {
    const evolutions = await this.prisma.passiveEvolution.findMany();
    const mapped = evolutions.map((evolution) => this.mapEvolution(evolution, language));
    return mapped.find((evolution) => evolution.slug === slug) ?? null;
  }

  private mapEvolution(
    evolution: {
      id: number;
      components_en: string;
      components_es: string;
      result_en: string;
      result_es: string;
    },
    language: SupportedLanguage
  ) {
    const componentsLabel =
      translateField(language, evolution.components_en, evolution.components_es) ??
      evolution.components_en;

    const components = componentsLabel
      .split(' + ')
      .map((component) => component.trim())
      .filter(Boolean);

    return {
      id: evolution.id,
      slug: slugify(evolution.result_en),
      components,
      componentsLabel,
      result: translateField(language, evolution.result_en, evolution.result_es) ?? evolution.result_en
    };
  }
}
