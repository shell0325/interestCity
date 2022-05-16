import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class createGenreRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
