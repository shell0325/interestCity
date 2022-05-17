import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/database/entities/channels.entity';
import { Users_Channels } from 'src/database/entities/users_channels.entity';
import { Repository } from 'typeorm';
import { ChannelResponseDto } from './dto/channel.response.dto';
import { createChannelRequestDto } from './dto/create-channel.request.dto';
import { UsersChannelResponseDto } from './dto/user-channel.response.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly _channelRepository: Repository<Channel>,
    @InjectRepository(Users_Channels)
    private readonly _usersChannelsRepository: Repository<Users_Channels>,
  ) {}

  async createChannel(
    channelData: createChannelRequestDto,
  ): Promise<ChannelResponseDto & UsersChannelResponseDto> {
    const createChannelData = {
      name: channelData.name,
      genreId: channelData.genreId,
      explanation: channelData.explanation,
    };
    const channel = await this._channelRepository.save(createChannelData);
    const joinChannelData = {
      userId: channelData.userId,
      channelId: channel.id,
      genreId: channelData.genreId,
    };
    const registerUsers_Channels = await this._usersChannelsRepository.save(joinChannelData);
    console.log(channel)
    console.log(registerUsers_Channels)
    return { channel: channel, users_channels: registerUsers_Channels };
  }
}
