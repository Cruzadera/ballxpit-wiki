import { Controller, Get, Headers, NotFoundException, Param } from '@nestjs/common';
import { resolveLanguage } from '../../common/i18n/language.util';
import { CharactersService } from './characters.service';

@Controller('wiki/characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  findAll(@Headers('accept-language') acceptLanguage?: string) {
    const language = resolveLanguage(acceptLanguage);
    return this.charactersService.findAll(language);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string, @Headers('accept-language') acceptLanguage?: string) {
    const language = resolveLanguage(acceptLanguage);
    const character = await this.charactersService.findBySlug(slug, language);

    if (!character) {
      throw new NotFoundException(`Character with slug ${slug} not found`);
    }

    return character;
  }
}
