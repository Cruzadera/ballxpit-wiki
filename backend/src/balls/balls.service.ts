import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BallsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.ball.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async findOne(id: number) {
    const ball = await this.prisma.ball.findUnique({ where: { id } });

    if (!ball) {
      throw new NotFoundException(`Ball with id ${id} not found`);
    }

    const [evolutionsFrom, evolutionsTo, fusionInputs, fusionResults] = await Promise.all([
      this.prisma.evolution.findMany({
        where: { baseBallId: id },
        include: { evolvedBall: true }
      }),
      this.prisma.evolution.findMany({
        where: { evolvedBallId: id },
        include: { baseBall: true }
      }),
      this.prisma.fusionRecipe.findMany({
        where: {
          inputs: {
            some: { ballId: id }
          }
        },
        select: {
          id: true,
          requiredLevel: true,
          origenA: true,
          origenB: true,
          resultado: true,
          descripcion: true,
          emoji: true,
          tipo: true,
          result: true,
          inputs: {
            select: {
              ball: true
            }
          }
        }
      }),
      this.prisma.fusionRecipe.findMany({
        where: { resultId: id },
        select: {
          id: true,
          requiredLevel: true,
          origenA: true,
          origenB: true,
          resultado: true,
          descripcion: true,
          emoji: true,
          tipo: true,
          result: true,
          inputs: {
            select: {
              ball: true
            }
          }
        }
      })
    ]);

    type FusionInputBall = NonNullable<
      (typeof fusionResults)[number]['inputs'][number]['ball']
    >;

    const mappedFusionResults = fusionResults.map((recipe) => ({
      id: recipe.id,
      requiredLevel: recipe.requiredLevel,
      origenA: recipe.origenA,
      origenB: recipe.origenB,
      resultado: recipe.resultado,
      descripcion: recipe.descripcion,
      emoji: recipe.emoji,
      tipo: recipe.tipo,
      result: recipe.result,
      inputs: recipe.inputs
        .map(({ ball }) => ball)
        .filter((inputBall): inputBall is FusionInputBall => Boolean(inputBall))
    }));

    const componentesMap = new Map<number, FusionInputBall>();

    mappedFusionResults.forEach((recipe) => {
      recipe.inputs.forEach((inputBall) => {
        if (!componentesMap.has(inputBall.id)) {
          componentesMap.set(inputBall.id, inputBall);
        }
      });
    });

    return {
      ...ball,
      evolutionsFrom,
      evolutionsTo,
      fusionInputs: fusionInputs.map((recipe) => ({
        id: recipe.id,
        requiredLevel: recipe.requiredLevel,
        origenA: recipe.origenA,
        origenB: recipe.origenB,
        resultado: recipe.resultado,
        descripcion: recipe.descripcion,
        emoji: recipe.emoji,
        tipo: recipe.tipo,
        result: recipe.result,
        inputs: recipe.inputs.map(({ ball }) => ball)
      })),
      fusionResults: mappedFusionResults,
      componentes: Array.from(componentesMap.values())
    };
  }
}
