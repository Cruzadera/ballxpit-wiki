import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CharactersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.character.findMany({
      orderBy: { name_es: 'asc' }
    });
  }

  async findOne(slug: string) {
    const character = await this.prisma.character.findUnique({
      where: { slug }
    });

    if (!character) {
      throw new NotFoundException(`Character with slug ${slug} not found`);
    }

    return character;
  }
}
