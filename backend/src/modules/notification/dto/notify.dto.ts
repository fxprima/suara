import { NotificationType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID, IsObject } from 'class-validator';

export class NotifyDto {
  @IsUUID()
  userId!: string;

  @IsEnum(NotificationType)
  type!: NotificationType;

  @IsOptional()
  @IsUUID()
  actorId?: string;

  @IsOptional()
  @IsUUID()
  gemaId?: string;

  ctx?: {
    actorUsername?: string;
    postSnippet?: string;
  };
}
