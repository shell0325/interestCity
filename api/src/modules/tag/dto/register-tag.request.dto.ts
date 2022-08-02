import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class registerTagRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  name: [];

  @IsNotEmpty()
  @ApiProperty()
  channelId: number;

  @IsNotEmpty()
  @ApiProperty()
  genreId: number;
}
