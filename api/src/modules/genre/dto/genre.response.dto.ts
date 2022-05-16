import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Genre } from 'src/database/entities/genres.entity';

export class GenreResponseDto {
  @IsNotEmpty()
  @ApiProperty()
  genre: Genre;
}
