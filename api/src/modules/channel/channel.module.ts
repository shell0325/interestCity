import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from 'src/database/entities/bookmarks.entity';
import { Channel } from 'src/database/entities/channels.entity';
import { Like } from 'src/database/entities/likes.entity';
import { Master_Comment } from 'src/database/entities/master_comments.entity';
import { Sub_Comment } from 'src/database/entities/sub_comments.entity';
import { Users_Channels } from 'src/database/entities/users_channels.entity';
import { ChannelController } from './channel.controller';
import { ChannelGateway } from './channel.gateway';
import { ChannelService } from './channel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      Users_Channels,
      Master_Comment,
      Like,
      Bookmark,
      Sub_Comment,
    ]),
  ],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelGateway],
  exports: [ChannelService],
})
export class ChannelModule {}
