import { PartialType } from '@nestjs/mapped-types';
import { CreateGemaDto } from './create-gema.dto';

export class UpdateGemaDto extends PartialType(CreateGemaDto) {}
