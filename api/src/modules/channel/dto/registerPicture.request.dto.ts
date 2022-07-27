import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class registerPictureRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  commentId: number;

  @IsNotEmpty()
  @ApiProperty()
  picture: string;

  @IsNotEmpty()
  @ApiProperty()
  key: string;
}
