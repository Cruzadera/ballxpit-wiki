import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { FusionsController } from './fusions.controller';
import { FusionsService } from './fusions.service';

@Module({
  imports: [PrismaModule],
  controllers: [FusionsController],
  providers: [FusionsService],
  exports: [FusionsService]
})
export class FusionsModule {}
