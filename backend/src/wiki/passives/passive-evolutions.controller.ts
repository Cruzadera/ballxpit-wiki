import { Controller, Get, Headers, NotFoundException, Param } from '@nestjs/common';
import { resolveLanguage } from '../../common/i18n/language.util';
import { PassiveEvolutionsService } from './passive-evolutions.service';

@Controller('wiki/passive-evolutions')
export class PassiveEvolutionsController {
  constructor(private readonly passiveEvolutionsService: PassiveEvolutionsService) {}

  @Get()
  findAll(@Headers('accept-language') acceptLanguage?: string) {
    const language = resolveLanguage(acceptLanguage);
    return this.passiveEvolutionsService.findAll(language);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string, @Headers('accept-language') acceptLanguage?: string) {
    const language = resolveLanguage(acceptLanguage);
    const evolution = await this.passiveEvolutionsService.findBySlug(slug, language);

    if (!evolution) {
      throw new NotFoundException(`Passive evolution with slug ${slug} not found`);
    }

    return evolution;
  }
}
