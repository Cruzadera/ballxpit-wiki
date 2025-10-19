import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SupportedLanguage, translateField } from '../../common/i18n/language.util';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(language: SupportedLanguage) {
    const items = await this.prisma.item.findMany({
      orderBy: { name: 'asc' }
    });

    return items.map((item) => this.mapItem(item, language));
  }

  async findBySlug(slug: string, language: SupportedLanguage) {
    const item = await this.prisma.item.findUnique({
      where: { slug }
    });

    if (!item) {
      return null;
    }

    return this.mapItem(item, language);
  }

  private mapItem(
    item: {
      slug: string;
      name: string;
      nombre: string | null;
      description: string | null;
      descripcion: string | null;
      imageUrl: string | null;
      type: string | null;
    },
    language: SupportedLanguage
  ) {
    return {
      slug: item.slug,
      name: translateField(language, item.name, item.nombre),
      description: translateField(language, item.description, item.descripcion),
      imageUrl: item.imageUrl,
      type: item.type
    };
  }
}
