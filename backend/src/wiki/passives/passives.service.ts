import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SupportedLanguage, translateField } from '../../common/i18n/language.util';

@Injectable()
export class PassivesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(language: SupportedLanguage) {
    const passives = await this.prisma.passive.findMany({
      orderBy: { name_en: 'asc' }
    });

    return passives.map((passive) => ({
      id: passive.id,
      name: translateField(language, passive.name_en, passive.name_es),
      description: translateField(language, passive.description_en, passive.description_es),
      imageUrl: passive.imageUrl
    }));
  }
}
