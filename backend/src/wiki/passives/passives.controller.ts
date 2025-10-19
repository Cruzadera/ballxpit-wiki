import { Controller, Get, Headers } from '@nestjs/common';
import { resolveLanguage } from '../../common/i18n/language.util';
import { PassivesService } from './passives.service';

@Controller('wiki/passives')
export class PassivesController {
  constructor(private readonly passivesService: PassivesService) {}

  @Get()
  findAll(@Headers('accept-language') acceptLanguage?: string) {
    const language = resolveLanguage(acceptLanguage);
    return this.passivesService.findAll(language);
  }
}
