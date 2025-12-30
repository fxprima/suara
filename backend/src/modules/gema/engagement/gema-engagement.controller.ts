import { Controller, Patch, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserPayload } from '../../auth/interfaces/user-payload.interface';
import { GemaEngagementService } from './gema-engagement.service';

@Controller('gema')
export class GemaEngagementController {
  constructor(private readonly engagement: GemaEngagementService) {}

  @Patch(':id/views')
  async incrementViews(@Param('id') id: string) {
    return await this.engagement.incrementViews(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/likes')
  async likeGema(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return await this.engagement.likeGema(user.id, id);
  }
}
