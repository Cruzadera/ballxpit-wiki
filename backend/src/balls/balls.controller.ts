import { Controller, Get, Param } from '@nestjs/common';
import { BallsService } from './balls.service';

@Controller('balls')
export class BallsController {
  constructor(private readonly ballsService: BallsService) {}

  @Get()
  findAll() {
    return this.ballsService.findAll();
  }

  @Get('puras')
  findPure() {
    return this.ballsService.findPure();
  }

  @Get('fusions')
  findFusionBalls() {
    return this.ballsService.findFusions();
  }

  @Get('evolutions')
  findEvolutionBalls() {
    return this.ballsService.findEvolutions();
  }

  @Get(':id')
  async getBallById(@Param('id') id: string) {
    return this.ballsService.findOne(Number(id));
  }
}
