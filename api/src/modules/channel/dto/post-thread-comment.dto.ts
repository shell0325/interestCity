import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class postThreadCommentRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  comment: Text[];

  @IsNotEmpty()
  @ApiProperty()
  userId: number;

  @IsNotEmpty()
  @ApiProperty()
  master_commentId: number;

  @IsNotEmpty()
  @ApiProperty()
  bookmark: boolean;
}
