import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFiles, Query} from '@nestjs/common';
import { GemaService } from './gema.service';
import { CreateGemaDto } from './dto/create-gema.dto';
import { UpdateGemaDto } from './dto/update-gema.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserPayload } from '../auth/interfaces/user-payload.interface';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from '../media/media.service';
import { OptionalJwtAuthGuard } from '../auth/guards/optional.jwt.auth.guard';

@Controller('gema')
export class GemaController {
  constructor(private readonly gemaService: GemaService, private readonly mediaService: MediaService) {}

  @UseInterceptors(
    FilesInterceptor('media', 4, {
      fileFilter: (_req, file, cb) => {
        const ok = /^(image|video)\//.test(file.mimetype);
        cb(ok ? null : new Error('Invalid mime'), ok);
      },
    }),
  )
  @UseGuards(JwtAuthGuard)
@Post()
  create(
    @Body() createGemaDto: CreateGemaDto, 
    @CurrentUser() user: UserPayload,
    @UploadedFiles() media: Express.Multer.File[] | undefined,
  ) {
    return this.gemaService.create(createGemaDto, user.id, media);
  }


  @Get(':userId/feed')
  async getUserFeed(
    @Param("userId") userId: string, 
    @Query('cursor') cursor?: string,
    @Query('limit') limit = 10
  ) {
    return this.gemaService.getUserFeed(userId, {cursor, limit: Number(limit)});
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('likes/:userId')
  async findLikedGemas(@Param('userId') userId: string) {
    return await this.gemaService.findLikedGemasByUser(userId);
  }

  @Patch(':id/views') 
  async incrementViews(@Param('id') id: string) {
    return await this.gemaService.incrementViews(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/likes')
  async likeGema(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return await this.gemaService.likeGema(user.id, id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.gemaService.findOne(id);
  }

  @Get('author/:userId')
  async getAuthorGemas(
    @Param('userId') userId: string,
    @Query('tab') tab: 'gemas' | 'replies' | 'media' | 'likes',
    @Query('cursor') cursor?: string,
    @Query('limit') limit = 10,
  ) {
    return await this.gemaService.getAuthorGemas(userId, { tab, cursor, limit: Number(limit) });
  }


}
