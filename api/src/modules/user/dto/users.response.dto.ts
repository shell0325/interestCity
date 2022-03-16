import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/database/entities/users.entity';

export class UsersResponseDto {
  @IsNotEmpty()
  @ApiProperty()
  users: User[];
}
