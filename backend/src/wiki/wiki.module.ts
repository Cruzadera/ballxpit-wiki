import { Module } from '@nestjs/common';
import { BallsModule } from './balls/balls.module';
import { CharactersModule } from './characters/characters.module';
import { EvolutionsModule } from './evolutions/evolutions.module';
import { FusionsModule } from './fusions/fusions.module';
import { ItemsModule } from './items/items.module';
import { WikiController } from './wiki.controller';

@Module({
  imports: [BallsModule, FusionsModule, EvolutionsModule, CharactersModule, ItemsModule],
  controllers: [WikiController]
})
export class WikiModule {}
