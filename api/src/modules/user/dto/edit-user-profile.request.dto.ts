import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class editUserProfileRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  userId: number;

  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  channelId: number;

  @IsNotEmpty()
  @ApiProperty()
  profileImagePath: Buffer & string;

  @IsNotEmpty()
  @ApiProperty()
  fileName: string;

  @ApiProperty()
  @MinLength(0)
  @MaxLength(255)
  self_introduction: string;
}
