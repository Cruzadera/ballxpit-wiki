import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EvolutionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.evolution.findMany({
      include: {
        result: true,
        components: {
          include: {
            ball: true
          }
        }
      },
      orderBy: { id: 'asc' }
    });
  }

  async findOne(id: number) {
    const evolution = await this.prisma.evolution.findUnique({
      where: { id },
      include: {
        result: true,
        components: {
          include: {
            ball: true
          }
        }
      }
    });

    if (!evolution) {
      throw new NotFoundException(`Evolution with id ${id} not found`);
    }

    return evolution;
  }
}
