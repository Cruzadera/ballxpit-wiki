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

  findPure() {
    return this.prisma.ball.findMany({
      where: { tipo: 'pura' },
      orderBy: { name: 'asc' }
    });
  }

  findFusions() {
    return this.prisma.ball.findMany({
      where: { tipo: 'fusion' },
      orderBy: { name: 'asc' }
    });
  }

  findEvolutions() {
    return this.prisma.ball.findMany({
      where: { tipo: 'evolucion' },
      orderBy: { name: 'asc' }
    });
  }

  async findOne(id: number) {
    const ball = await this.prisma.ball.findUnique({
      where: { id },
      include: {
        fusionResults: {
          include: {
            inputs: {
              include: {
                ball: true
              }
            }
          }
        },
        fusionInputs: {
          include: {
            recipe: {
              include: {
                result: true
              }
            }
          }
        },
        evolutionResults: {
          include: {
            components: {
              include: {
                ball: true
              }
            }
          }
        },
        evolutionComponents: {
          include: {
            evolution: {
              include: {
                result: true
              }
            }
          }
        }
      }
    });

    if (!ball) {
      throw new NotFoundException(`Ball with id ${id} not found`);
    }

    const componentesMap = new Map<number, { id: number; name?: string | null; nombre?: string | null }>();

    if (ball.tipo === 'fusion') {
      ball.fusionResults.forEach((recipe) => {
        recipe.inputs.forEach(({ ball: inputBall }) => {
          if (inputBall) {
            componentesMap.set(inputBall.id, {
              id: inputBall.id,
              name: inputBall.name,
              nombre: (inputBall as { nombre?: string | null }).nombre ?? inputBall.nombre
            });
          }
        });
      });
    } else if (ball.tipo === 'evolucion') {
      ball.evolutionResults.forEach((evolution) => {
        evolution.components.forEach(({ ball: componentBall }) => {
          if (componentBall) {
            componentesMap.set(componentBall.id, {
              id: componentBall.id,
              name: componentBall.name,
              nombre:
                (componentBall as { nombre?: string | null }).nombre ?? componentBall.nombre
            });
          }
        });
      });
    }

    const componentes = Array.from(componentesMap.values());

    const fusionesRelacionadasMap = new Map<
      number,
      { id: number; name?: string | null; nombre?: string | null }
    >();

    ball.fusionInputs.forEach(({ recipe }) => {
      if (recipe?.result) {
        fusionesRelacionadasMap.set(recipe.result.id, {
          id: recipe.result.id,
          name: recipe.result.name,
          nombre: (recipe.result as { nombre?: string | null }).nombre ?? recipe.result.nombre
        });
      }
    });

    const evolucionesRelacionadasMap = new Map<
      number,
      { id: number; name?: string | null; nombre?: string | null }
    >();

    ball.evolutionComponents.forEach(({ evolution }) => {
      if (evolution?.result) {
        evolucionesRelacionadasMap.set(evolution.result.id, {
          id: evolution.result.id,
          name: evolution.result.name,
          nombre:
            (evolution.result as { nombre?: string | null }).nombre ?? evolution.result.nombre
        });
      }
    });

    const { fusionResults, fusionInputs, evolutionResults, evolutionComponents, ...rest } = ball;

    return {
      ...rest,
      componentes,
      fusionesRelacionadas: Array.from(fusionesRelacionadasMap.values()),
      evolucionesRelacionadas: Array.from(evolucionesRelacionadasMap.values())
    };
  }
}
