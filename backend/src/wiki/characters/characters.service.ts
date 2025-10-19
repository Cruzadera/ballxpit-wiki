import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SupportedLanguage, translateField } from '../../common/i18n/language.util';

@Injectable()
export class CharactersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(language: SupportedLanguage) {
    const characters = await this.prisma.character.findMany({
      orderBy: { name: 'asc' }
    });

    return characters.map((character) => this.mapCharacter(character, language));
  }

  async findBySlug(slug: string, language: SupportedLanguage) {
    const character = await this.prisma.character.findUnique({
      where: { slug }
    });

    if (!character) {
      return null;
    }

    return this.mapCharacter(character, language);
  }

  private mapCharacter(
    character: {
      slug: string;
      name: string;
      nombre: string | null;
      description: string | null;
      descripcion: string | null;
      imageUrl: string | null;
      title: string | null;
      titulo: string | null;
    },
    language: SupportedLanguage
  ) {
    return {
      slug: character.slug,
      name: translateField(language, character.name, character.nombre),
      description: translateField(language, character.description, character.descripcion),
      imageUrl: character.imageUrl,
      title: translateField(language, character.title, character.titulo)
    };
  }
}
