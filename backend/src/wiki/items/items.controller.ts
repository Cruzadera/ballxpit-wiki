import { Controller, Get, Headers, NotFoundException, Param } from '@nestjs/common';
import { resolveLanguage } from '../../common/i18n/language.util';
import { ItemsService } from './items.service';

@Controller('wiki/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(@Headers('accept-language') acceptLanguage?: string) {
    const language = resolveLanguage(acceptLanguage);
    return this.itemsService.findAll(language);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string, @Headers('accept-language') acceptLanguage?: string) {
    const language = resolveLanguage(acceptLanguage);
    const item = await this.itemsService.findBySlug(slug, language);

    if (!item) {
      throw new NotFoundException(`Item with slug ${slug} not found`);
    }

    return item;
  }
}
