import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class joinChannelRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  userId: number;

  @IsNotEmpty()
  @ApiProperty()
  genreId: number;

  @IsNotEmpty()
  @ApiProperty()
  channelId: number;
}
