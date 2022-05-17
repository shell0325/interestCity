import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Master_Comment } from 'src/database/entities/master_comments.entity';

export class CommentResponseDto {
  @IsNotEmpty()
  @ApiProperty()
  comment: Master_Comment;
}
