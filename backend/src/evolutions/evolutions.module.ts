import { Module } from '@nestjs/common';
import { EvolutionsService } from './evolutions.service';
import { EvolutionsController } from './evolutions.controller';

@Module({
  controllers: [EvolutionsController],
  providers: [EvolutionsService]
})
export class EvolutionsModule {}
