import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const ballSelection = {
  id: true,
  name: true,
  nombre: true,
  type: true,
  tipo: true,
  level: true,
  description: true,
  descripcion: true,
  imageUrl: true
} satisfies Prisma.BallSelect;

@Injectable()
export class FusionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const recipes = await this.prisma.fusionRecipe.findMany({
      include: {
        result: { select: ballSelection },
        inputs: {
          include: {
            ball: { select: ballSelection }
          }
        }
      },
      orderBy: { id: 'asc' }
    });

    return recipes.map(({ inputs, ...recipe }) => ({
      ...recipe,
      inputs: inputs.map(({ ball }) => ball)
    }));
  }

  async findOne(id: number) {
    const fusion = await this.prisma.fusionRecipe.findUnique({
      where: { id },
      include: {
        result: { select: ballSelection },
        inputs: {
          include: {
            ball: { select: ballSelection }
          }
        }
      }
    });

    if (!fusion) {
      throw new NotFoundException(`Fusion recipe with id ${id} not found`);
    }

    return {
      ...fusion,
      inputs: fusion.inputs.map(({ ball }) => ball)
    };
  }
}
