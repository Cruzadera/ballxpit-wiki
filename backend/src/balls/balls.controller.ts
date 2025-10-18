import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BallsService } from './balls.service';

@Controller('balls')
export class BallsController {
  constructor(private readonly ballsService: BallsService) {}

  @Get()
  findAll() {
    return this.ballsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ballsService.findOne(id);
  }
}
