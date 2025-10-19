import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SupportedLanguage, translateField } from '../../common/i18n/language.util';

type BallWithRelations = Prisma.BallGetPayload<{
  include: {
    fusionResults: {
      include: {
        components: {
          include: {
            ball: true;
          };
        };
      };
    };
    fusionsAsComponent: {
      include: {
        fusion: {
          include: {
            result: true;
          };
        };
      };
    };
    evolutionsAsBase: {
      include: {
        resultBall: true;
      };
    };
    evolutionsAsResult: {
      include: {
        baseBall: true;
      };
    };
  };
}>;

type BallCategory = 'pure' | 'fusion' | 'evolution';

const BALL_TYPE_ORDER: Record<BallCategory, number> = {
  pure: 0,
  fusion: 1,
  evolution: 2
};

@Injectable()
export class BallsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(language: SupportedLanguage) {
    const balls = await this.prisma.ball.findMany({
      include: {
        fusionResults: true,
        fusionsAsComponent: true,
        evolutionsAsResult: true
      }
    });

    const mapped = balls.map((ball) => ({
      slug: ball.slug,
      name: translateField(language, ball.name, ball.nombre),
      description: translateField(language, ball.description, ball.descripcion),
      imageUrl: ball.imageUrl,
      type: (ball.type as BallCategory | null) ?? null,
      tags: this.buildTags({ type: ball.type })
    }));

    const locale = language === 'es' ? 'es' : 'en';

    return mapped.sort((a, b) => {
      const aRank = this.getTypeRank(a.type);
      const bRank = this.getTypeRank(b.type);

      if (aRank !== bRank) {
        return aRank - bRank;
      }

      const aName = a.name ?? '';
      const bName = b.name ?? '';

      return aName.localeCompare(bName, locale, { sensitivity: 'base' });
    });
  }

  async findBySlug(slug: string, language: SupportedLanguage) {
    const ball = await this.prisma.ball.findUnique({
      where: { slug },
      include: {
        fusionResults: {
          include: {
            components: {
              include: {
                ball: true
              }
            }
          }
        },
        fusionsAsComponent: {
          include: {
            fusion: {
              include: {
                result: true
              }
            }
          }
        },
        evolutionsAsBase: {
          include: {
            resultBall: true
          }
        },
        evolutionsAsResult: {
          include: {
            baseBall: true
          }
        }
      }
    });

    if (!ball) {
      return null;
    }

    return this.mapDetailedBall(ball, language);
  }

  private mapDetailedBall(ball: BallWithRelations, language: SupportedLanguage) {
    return {
      slug: ball.slug,
      name: translateField(language, ball.name, ball.nombre),
      description: translateField(language, ball.description, ball.descripcion),
      imageUrl: ball.imageUrl,
      type: (ball.type as BallCategory | null) ?? null,
      tags: this.buildTags({ type: ball.type }),
      fusionsFrom: ball.fusionResults.map((fusion) => ({
        slug: fusion.slug,
        description: translateField(language, fusion.description, fusion.descripcion),
        result: {
          slug: ball.slug,
          name: translateField(language, ball.name, ball.nombre),
          imageUrl: ball.imageUrl
        },
        components: fusion.components
          .filter((component) => component.ball)
          .map((component) => ({
            slug: component.ball.slug,
            name: translateField(language, component.ball.name, component.ball.nombre),
            imageUrl: component.ball.imageUrl
          }))
      })),
      fusionsInto: ball.fusionsAsComponent.map(({ fusion }) => ({
        slug: fusion.slug,
        result: {
          slug: fusion.result.slug,
          name: translateField(language, fusion.result.name, fusion.result.nombre),
          imageUrl: fusion.result.imageUrl
        }
      })),
      evolutionsFrom: ball.evolutionsAsBase.map((evolution) => ({
        slug: evolution.slug,
        result: {
          slug: evolution.resultBall.slug,
          name: translateField(language, evolution.resultBall.name, evolution.resultBall.nombre),
          imageUrl: evolution.resultBall.imageUrl
        },
        description: translateField(language, evolution.description, evolution.descripcion)
      })),
      evolutionsInto: ball.evolutionsAsResult.map((evolution) => ({
        slug: evolution.slug,
        base: {
          slug: evolution.baseBall.slug,
          name: translateField(language, evolution.baseBall.name, evolution.baseBall.nombre),
          imageUrl: evolution.baseBall.imageUrl
        },
        description: translateField(language, evolution.description, evolution.descripcion)
      }))
    };
  }

  private buildTags(ball: { type: string | null }) {
    if (!ball.type) {
      return [];
    }

    return ['pure', 'fusion', 'evolution'].includes(ball.type)
      ? [ball.type as BallCategory]
      : [];
  }

  private getTypeRank(type: string | null | undefined) {
    if (!type || !['pure', 'fusion', 'evolution'].includes(type)) {
      return Number.MAX_SAFE_INTEGER;
    }

    return BALL_TYPE_ORDER[type as BallCategory];
  }
}
