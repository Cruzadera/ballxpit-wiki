import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SupportedLanguage, translateField } from '../../common/i18n/language.util';

type BallWithRelations = Prisma.BallGetPayload<{
  include: {
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

type BallCategory = 'pure' | 'evolution';

const BALL_TYPE_ORDER: Record<BallCategory, number> = {
  pure: 0,
  evolution: 1
};

@Injectable()
export class BallsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(language: SupportedLanguage) {
    const balls = await this.prisma.ball.findMany({
      include: {
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

    return ['pure', 'evolution'].includes(ball.type)
      ? [ball.type as BallCategory]
      : [];
  }

  private getTypeRank(type: string | null | undefined) {
    if (!type || !['pure', 'evolution'].includes(type)) {
      return Number.MAX_SAFE_INTEGER;
    }

    return BALL_TYPE_ORDER[type as BallCategory];
  }
}
