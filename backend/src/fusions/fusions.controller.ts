import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FusionsService } from './fusions.service';

@Controller('fusions')
export class FusionsController {
  constructor(private readonly fusionsService: FusionsService) {}

  @Get()
  async findAll() {
    return this.fusionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fusionsService.findOne(id);
  }
}
