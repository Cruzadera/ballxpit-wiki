import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { WikiModule } from './wiki/wiki.module';

@Module({
  imports: [PrismaModule, WikiModule]
})
export class AppModule {}
