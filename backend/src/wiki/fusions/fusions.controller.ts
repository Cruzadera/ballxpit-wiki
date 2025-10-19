import { Controller, Get, Headers, NotFoundException, Param } from '@nestjs/common';
import { resolveLanguage } from '../../common/i18n/language.util';
import { FusionsService } from './fusions.service';

@Controller('wiki/fusions')
export class FusionsController {
  constructor(private readonly fusionsService: FusionsService) {}

  @Get()
  findAll(@Headers('accept-language') acceptLanguage?: string) {
    const language = resolveLanguage(acceptLanguage);
    return this.fusionsService.findAll(language);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string, @Headers('accept-language') acceptLanguage?: string) {
    const language = resolveLanguage(acceptLanguage);
    const fusion = await this.fusionsService.findBySlug(slug, language);

    if (!fusion) {
      throw new NotFoundException(`Fusion with slug ${slug} not found`);
    }

    return fusion;
  }
}
