import { Module } from '@nestjs/common';
import { BallsModule } from './balls/balls.module';
import { FusionsModule } from './fusions/fusions.module';
import { EvolutionsModule } from './evolutions/evolutions.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, BallsModule, FusionsModule, EvolutionsModule]
})
export class AppModule {}
