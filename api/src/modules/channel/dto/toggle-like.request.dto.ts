import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class toggleLikeRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  master_commentId: number;

  @IsNotEmpty()
  @ApiProperty()
  userId: number;

  @IsNotEmpty()
  @ApiProperty()
  channelId: number;
}
