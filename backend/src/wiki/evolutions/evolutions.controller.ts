import { Controller, Get, Headers, NotFoundException, Param } from '@nestjs/common';
import { resolveLanguage } from '../../common/i18n/language.util';
import { EvolutionsService } from './evolutions.service';

@Controller('wiki/evolutions')
export class EvolutionsController {
  constructor(private readonly evolutionsService: EvolutionsService) {}

  @Get()
  findAll(@Headers('accept-language') acceptLanguage?: string) {
    const language = resolveLanguage(acceptLanguage);
    return this.evolutionsService.findAll(language);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string, @Headers('accept-language') acceptLanguage?: string) {
    const language = resolveLanguage(acceptLanguage);
    const evolution = await this.evolutionsService.findBySlug(slug, language);

    if (!evolution) {
      throw new NotFoundException(`Evolution with slug ${slug} not found`);
    }

    return evolution;
  }
}
