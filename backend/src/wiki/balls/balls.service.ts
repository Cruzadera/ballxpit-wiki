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

@Injectable()
export class BallsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(language: SupportedLanguage) {
    const balls = await this.prisma.ball.findMany({
      orderBy: { name: 'asc' },
      include: {
        fusionResults: true,
        fusionsAsComponent: true,
        evolutionsAsResult: true
      }
    });

    return balls.map((ball) => ({
      slug: ball.slug,
      name: translateField(language, ball.name, ball.nombre),
      description: translateField(language, ball.description, ball.descripcion),
      imageUrl: ball.imageUrl,
      isPure: ball.isPure,
      tags: this.buildTags(ball)
    }));
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
      isPure: ball.isPure,
      tags: this.buildTags(ball),
      fusionRecipes: ball.fusionResults.map((fusion) => ({
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
      fusionAppearances: ball.fusionsAsComponent.map(({ fusion }) => ({
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

  private buildTags(ball: {
    isPure: boolean;
    fusionResults: { length: number };
    evolutionsAsResult: { length: number };
  }) {
    const tags: string[] = [];

    if (ball.isPure) {
      tags.push('pure');
    }

    if (ball.fusionResults.length > 0) {
      tags.push('fusion');
    }

    if (ball.evolutionsAsResult.length > 0) {
      tags.push('evolution');
    }

    return tags;
  }
}
