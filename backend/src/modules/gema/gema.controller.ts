import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { GemaService } from './gema.service';
import { CreateGemaDto } from './dto/create-gema.dto';
import { UpdateGemaDto } from './dto/update-gema.dto';
import { Request } from 'express';

@Controller('gema')
export class GemaController {
  constructor(private readonly gemaService: GemaService) {}

  @Post()
  create(@Body() createGemaDto: CreateGemaDto, @Req() req: Request) {
    return 'this.gemaService.create(createGemaDto, req.user.id);'
  }

  @Get()
  findAll() {
    return this.gemaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gemaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGemaDto: UpdateGemaDto) {
    return this.gemaService.update(+id, updateGemaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gemaService.remove(+id);
  }
}
