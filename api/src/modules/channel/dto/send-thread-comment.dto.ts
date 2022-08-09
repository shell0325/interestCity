import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class sendThreadCommentRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  comment: Text[];

  @IsNotEmpty()
  @ApiProperty()
  userId: number;

  @IsNotEmpty()
  @ApiProperty()
  master_commentId: number;
}
