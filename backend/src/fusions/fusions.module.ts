import { Module } from '@nestjs/common';
import { FusionsService } from './fusions.service';
import { FusionsController } from './fusions.controller';

@Module({
  controllers: [FusionsController],
  providers: [FusionsService]
})
export class FusionsModule {}
