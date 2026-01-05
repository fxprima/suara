import { IsEnum, IsOptional, IsString, IsUUID, IsObject } from 'class-validator';

export enum NotificationType {
  LIKE = 'LIKE',
  REPLY = 'REPLY',
  REPOST = 'REPOST',
  FOLLOW = 'FOLLOW',
  MENTION = 'MENTION',
  SYSTEM = 'SYSTEM',
}

export class CreateNotifDto {
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

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
