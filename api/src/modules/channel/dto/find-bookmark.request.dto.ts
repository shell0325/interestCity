import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class findBookmarkRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  genreId: number;

  @IsNotEmpty()
  @ApiProperty()
  userId: number;
}
