import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class sendCommentRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  comment: Text[];

  @IsNotEmpty()
  @ApiProperty()
  userId: number;

  @IsNotEmpty()
  @ApiProperty()
  channelId: number;

  @IsNotEmpty()
  @ApiProperty()
  sendImage: any;

  @IsNotEmpty()
  @ApiProperty()
  pictureName: string;
}
