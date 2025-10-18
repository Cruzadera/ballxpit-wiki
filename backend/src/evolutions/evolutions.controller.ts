import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EvolutionsService } from './evolutions.service';

@Controller('evolutions')
export class EvolutionsController {
  constructor(private readonly evolutionsService: EvolutionsService) {}

  @Get()
  findAll() {
    return this.evolutionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.evolutionsService.findOne(id);
  }
}
