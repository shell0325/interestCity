import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class registerProfileImageRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  profileImagePath: string;

  @IsNotEmpty()
  @ApiProperty()
  key: string;
}
