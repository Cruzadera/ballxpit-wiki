import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SupportedLanguage, translateField } from '../../common/i18n/language.util';

type EvolutionWithRelations = Prisma.EvolutionGetPayload<{
  include: {
    baseBall: true;
    resultBall: true;
  };
}>;

@Injectable()
export class EvolutionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(language: SupportedLanguage) {
    const evolutions = await this.prisma.evolution.findMany({
      where: {
        resultBall: {
          type: 'evolution'
        }
      },
      orderBy: { slug: 'asc' },
      include: {
        baseBall: true,
        resultBall: true
      }
    });

    return evolutions.map((evolution) => this.mapEvolution(evolution, language));
  }

  async findBySlug(slug: string, language: SupportedLanguage) {
    const evolution = await this.prisma.evolution.findUnique({
      where: { slug },
      include: {
        baseBall: true,
        resultBall: true
      }
    });

    if (!evolution) {
      return null;
    }

    if (evolution.resultBall.type !== 'evolution') {
      return null;
    }

    return this.mapEvolution(evolution, language);
  }

  private mapEvolution(evolution: EvolutionWithRelations, language: SupportedLanguage) {
    return {
      slug: evolution.slug,
      description: translateField(language, evolution.description, evolution.descripcion),
      base: {
        slug: evolution.baseBall.slug,
        name: translateField(language, evolution.baseBall.name, evolution.baseBall.nombre),
        imageUrl: evolution.baseBall.imageUrl
      },
      result: {
        slug: evolution.resultBall.slug,
        name: translateField(language, evolution.resultBall.name, evolution.resultBall.nombre),
        imageUrl: evolution.resultBall.imageUrl
      }
    };
  }
}
