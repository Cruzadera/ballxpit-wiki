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
    const ball = await this.prisma.ball.findUnique({
      where: { id },
      include: {
        evolutionsFrom: {
          include: {
            evolvedBall: true
          }
        },
        evolutionsTo: {
          include: {
            baseBall: true
          }
        },
        fusionInputs: {
          include: {
            recipe: {
              include: {
                result: true,
                inputs: {
                  include: {
                    ball: true
                  }
                }
              }
            }
          }
        },
        fusionResults: {
          include: {
            inputs: {
              include: {
                ball: true
              }
            }
          }
        }
      }
    });

    if (!ball) {
      throw new NotFoundException(`Ball with id ${id} not found`);
    }

    return ball;
  }
}
