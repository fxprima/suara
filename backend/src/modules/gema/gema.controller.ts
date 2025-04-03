import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { GemaService } from './gema.service';
import { CreateGemaDto } from './dto/create-gema.dto';
import { UpdateGemaDto } from './dto/update-gema.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserPayload } from '../auth/interfaces/user-payload.interface';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';

@Controller('gema')
export class GemaController {
  constructor(private readonly gemaService: GemaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createGemaDto: CreateGemaDto, @CurrentUser() user: UserPayload) {
    return this.gemaService.create(createGemaDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.gemaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log("ketembak ", id)
    return await this.gemaService.findOne(id);
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
