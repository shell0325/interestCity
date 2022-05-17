import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Channel } from 'src/database/entities/channels.entity';

export class ChannelResponseDto {
  @IsNotEmpty()
  @ApiProperty()
  channel: Channel;
}
