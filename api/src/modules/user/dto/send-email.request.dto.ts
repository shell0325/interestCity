import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Max, MaxLength, MinLength } from 'class-validator';

export class sendEmailRequestDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;
}
