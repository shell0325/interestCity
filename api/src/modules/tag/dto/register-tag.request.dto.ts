import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class registerTagRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string[];

  @IsNotEmpty()
  @ApiProperty()
  channelId: number;

  @IsNotEmpty()
  @ApiProperty()
  genreId: number;
}
