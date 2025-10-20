import { Module } from '@nestjs/common';
import { BallsModule } from './balls/balls.module';
import { CharactersModule } from './characters/characters.module';
import { EvolutionsModule } from './evolutions/evolutions.module';
import { ItemsModule } from './items/items.module';
import { PassivesModule } from './passives/passives.module';
import { WikiController } from './wiki.controller';

@Module({
  imports: [BallsModule, EvolutionsModule, PassivesModule, CharactersModule, ItemsModule],
  controllers: [WikiController]
})
export class WikiModule {}
