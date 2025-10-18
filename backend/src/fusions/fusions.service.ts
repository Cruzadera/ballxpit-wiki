import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FusionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.fusionRecipe.findMany({
      include: {
        result: true,
        inputs: {
          include: { ball: true }
        }
      },
      orderBy: { id: 'asc' }
    });
  }

  async findOne(id: number) {
    const fusion = await this.prisma.fusionRecipe.findUnique({
      where: { id },
      include: {
        result: true,
        inputs: {
          include: { ball: true }
        }
      }
    });

    if (!fusion) {
      throw new NotFoundException(`Fusion recipe with id ${id} not found`);
    }

    return fusion;
  }
}
