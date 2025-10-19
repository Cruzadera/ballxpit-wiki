import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SupportedLanguage, translateField } from '../../common/i18n/language.util';

type FusionWithRelations = Prisma.FusionGetPayload<{
  include: {
    result: true;
    components: {
      include: {
        ball: true;
      };
    };
  };
}>;

@Injectable()
export class FusionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(language: SupportedLanguage) {
    const fusions = await this.prisma.fusion.findMany({
      where: {
        result: {
          type: 'fusion'
        }
      },
      orderBy: { slug: 'asc' },
      include: {
        result: true,
        components: {
          include: {
            ball: true
          }
        }
      }
    });

    return fusions.map((fusion) => this.mapFusion(fusion, language));
  }

  async findBySlug(slug: string, language: SupportedLanguage) {
    const fusion = await this.prisma.fusion.findUnique({
      where: { slug },
      include: {
        result: true,
        components: {
          include: {
            ball: true
          }
        }
      }
    });

    if (!fusion) {
      return null;
    }

    if (fusion.result.type !== 'fusion') {
      return null;
    }

    return this.mapFusion(fusion, language);
  }

  private mapFusion(fusion: FusionWithRelations, language: SupportedLanguage) {
    return {
      slug: fusion.slug,
      description: translateField(language, fusion.description, fusion.descripcion),
      result: {
        slug: fusion.result.slug,
        name: translateField(language, fusion.result.name, fusion.result.nombre),
        imageUrl: fusion.result.imageUrl
      },
      components: fusion.components
        .filter((component) => component.ball)
        .map((component) => ({
          slug: component.ball.slug,
          name: translateField(language, component.ball.name, component.ball.nombre),
          imageUrl: component.ball.imageUrl
        }))
    };
  }
}
