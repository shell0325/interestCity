import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class editUserDataRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  userId: number;

  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @ApiProperty()
  @MinLength(0)
  @MaxLength(255)
  self_introduction: string;
}
