import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/database/entities/users.entity';

export class UserResponseDto {
  @IsNotEmpty()
  @ApiProperty()
  user: User;
}
