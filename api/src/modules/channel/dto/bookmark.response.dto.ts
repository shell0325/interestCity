import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Bookmark } from 'src/database/entities/bookmarks.entity';

export class BookmarkResponseDto {
  @IsNotEmpty()
  @ApiProperty()
  bookmark: Bookmark;
}
