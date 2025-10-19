import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { BallsController } from './balls.controller';
import { BallsService } from './balls.service';

@Module({
  imports: [PrismaModule],
  providers: [BallsService],
  controllers: [BallsController],
  exports: [BallsService]
})
export class BallsModule {}
