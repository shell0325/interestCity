import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Tag } from 'src/database/entities/tags.entity';

export class TagsResponseDto {
  @IsNotEmpty()
  @ApiProperty()
  tags: Tag[];
}
