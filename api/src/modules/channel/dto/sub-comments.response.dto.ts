import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Sub_Comment } from 'src/database/entities/sub_comments.entity';

export class SubCommentsResponseDto {
  @IsNotEmpty()
  @ApiProperty()
  subComment: Sub_Comment[];
}
