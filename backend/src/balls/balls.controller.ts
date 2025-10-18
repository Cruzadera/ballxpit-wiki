import { Controller, Get, Param } from '@nestjs/common';
import { BallsService } from './balls.service';

@Controller('balls')
export class BallsController {
  constructor(private readonly ballsService: BallsService) {}

  @Get()
  findAll() {
    return this.ballsService.findAll();
  }

  @Get(':id')
  async getBallById(@Param('id') id: string) {
    return this.ballsService.findOne(Number(id));
  }
}
