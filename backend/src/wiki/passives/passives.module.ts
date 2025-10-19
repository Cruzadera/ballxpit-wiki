import { Module } from '@nestjs/common';
import { PassiveEvolutionsController } from './passive-evolutions.controller';
import { PassiveEvolutionsService } from './passive-evolutions.service';
import { PassivesController } from './passives.controller';
import { PassivesService } from './passives.service';

@Module({
  controllers: [PassivesController, PassiveEvolutionsController],
  providers: [PassivesService, PassiveEvolutionsService]
})
export class PassivesModule {}
