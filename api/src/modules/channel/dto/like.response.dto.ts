import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Like } from 'src/database/entities/likes.entity';

export class LikeResponseDto {
  @IsNotEmpty()
  @ApiProperty()
  like: Like;
}
