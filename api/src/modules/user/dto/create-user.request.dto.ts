import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Max, MaxLength, MinLength } from 'class-validator';

export class createUserRequestDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty()
  password: string;
}
