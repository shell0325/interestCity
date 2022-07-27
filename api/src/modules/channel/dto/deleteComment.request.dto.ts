import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class deleteCommentRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  master_commentId: number;

  @IsNotEmpty()
  @ApiProperty()
  key: string;
}
