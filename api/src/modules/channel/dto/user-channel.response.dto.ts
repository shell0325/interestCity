import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Users_Channels } from 'src/database/entities/users_channels.entity';

export class UsersChannelResponseDto {
  @IsNotEmpty()
  @ApiProperty()
  users_channels: Users_Channels;
}
