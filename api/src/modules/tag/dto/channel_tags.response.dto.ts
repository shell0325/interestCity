import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Channels_Tags } from 'src/database/entities/channels_tags.entity';
import { Tag } from 'src/database/entities/tags.entity';

export class ChannelTagsResponseDto {
  @IsNotEmpty()
  @ApiProperty()
  channel_tags: Channels_Tags[];
}
