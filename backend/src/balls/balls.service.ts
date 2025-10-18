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
        include: {
          result: true,
          inputs: {
            include: {
              ball: true
            }
          }
        }
      }),
      this.prisma.fusionRecipe.findMany({
        where: { resultId: id },
        include: {
          result: true,
          inputs: {
            include: {
              ball: true
            }
          }
        }
      })
    ]);

    return {
      ...ball,
      evolutionsFrom,
      evolutionsTo,
      fusionInputs: fusionInputs.map((recipe) => ({
        id: recipe.id,
        requiredLevel: recipe.requiredLevel,
        result: recipe.result,
        inputs: recipe.inputs.map(({ ball }) => ball)
      })),
      fusionResults: fusionResults.map((recipe) => ({
        id: recipe.id,
        requiredLevel: recipe.requiredLevel,
        result: recipe.result,
        inputs: recipe.inputs.map(({ ball }) => ball)
      }))
    };
  }
}
