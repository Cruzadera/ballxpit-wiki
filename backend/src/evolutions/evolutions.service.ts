import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EvolutionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.evolution.findMany({
      include: {
        baseBall: true,
        evolvedBall: true
      },
      orderBy: { id: 'asc' }
    });
  }

  async findOne(id: number) {
    const evolution = await this.prisma.evolution.findUnique({
      where: { id },
      include: {
        baseBall: true,
        evolvedBall: true
      }
    });

    if (!evolution) {
      throw new NotFoundException(`Evolution with id ${id} not found`);
    }

    return evolution;
  }
}
