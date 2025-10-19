import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SupportedLanguage, translateField } from '../../common/i18n/language.util';

@Injectable()
export class CharactersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(language: SupportedLanguage) {
    const characters = await this.prisma.character.findMany({
      orderBy: { nameEn: 'asc' }
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
      nameEn: string;
      nameEs: string;
      descriptionEn: string | null;
      descriptionEs: string | null;
      startingBallEn: string | null;
      startingBallEs: string | null;
      unlockRequirementEn: string | null;
      unlockRequirementEs: string | null;
      imageUrl: string | null;
    },
    language: SupportedLanguage
  ) {
    return {
      slug: character.slug,
      name: translateField(language, character.nameEn, character.nameEs),
      description: translateField(language, character.descriptionEn, character.descriptionEs),
      startingBall: translateField(language, character.startingBallEn, character.startingBallEs),
      unlockRequirement: translateField(
        language,
        character.unlockRequirementEn,
        character.unlockRequirementEs
      ),
      imageUrl: character.imageUrl
    };
  }
}
