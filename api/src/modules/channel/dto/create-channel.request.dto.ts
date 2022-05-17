import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class createChannelRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  genreId: number;

  @IsNotEmpty()
  @ApiProperty()
  userId: number;

  @ApiProperty()
  @MinLength(0)
  @MaxLength(255)
  explanation: string;
}
