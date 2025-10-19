import { Controller, Get, Headers, NotFoundException, Param } from '@nestjs/common';
import { resolveLanguage } from '../../common/i18n/language.util';
import { BallsService } from './balls.service';

@Controller('wiki/balls')
export class BallsController {
  constructor(private readonly ballsService: BallsService) {}

  @Get()
  findAll(@Headers('accept-language') acceptLanguage?: string) {
    const language = resolveLanguage(acceptLanguage);
    return this.ballsService.findAll(language);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string, @Headers('accept-language') acceptLanguage?: string) {
    const language = resolveLanguage(acceptLanguage);
    const ball = await this.ballsService.findBySlug(slug, language);

    if (!ball) {
      throw new NotFoundException(`Ball with slug ${slug} not found`);
    }

    return ball;
  }
}
