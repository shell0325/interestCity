import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Users_Genres } from 'src/database/entities/users_genres.entity';

export class UsersGenresResponseDto {
  @IsNotEmpty()
  @ApiProperty()
  usersGenres: Users_Genres[];
}
