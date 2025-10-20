import { Controller, Get, Headers } from '@nestjs/common';
import { resolveLanguage } from '../common/i18n/language.util';

type MetaSection = {
  path: string;
  icon: string;
  labels: Record<'en' | 'es', string>;
};

const META_SECTIONS: MetaSection[] = [
  { path: '/wiki/balls', icon: '🟣', labels: { en: 'Balls', es: 'Bolas' } },
  { path: '/wiki/evolutions', icon: '🧬', labels: { en: 'Evolutions', es: 'Evoluciones' } },
  { path: '/wiki/passives', icon: '🧿', labels: { en: 'Passives', es: 'Pasivas' } },
  { path: '/wiki/characters', icon: '⚔️', labels: { en: 'Characters', es: 'Personajes' } }
];

@Controller('wiki')
export class WikiController {
  @Get('meta')
  getMeta(@Headers('accept-language') acceptLanguage?: string) {
    const language = resolveLanguage(acceptLanguage);

    return {
      sections: META_SECTIONS.map((section) => ({
        path: section.path,
        icon: section.icon,
        label: section.labels[language]
      }))
    };
  }
}
