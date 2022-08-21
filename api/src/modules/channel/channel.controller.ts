import { Body, Controller, Post } from '@nestjs/common';
import { CreatedResponse } from 'src/common/types/response';
import { ChannelService } from './channel.service';
import { ChannelResponseDto } from './dto/channel.response.dto';
import { createChannelRequestDto } from './dto/create-channel.request.dto';

@Controller('channel')
export class ChannelController {
  constructor(private readonly _channelService: ChannelService) {}

  /**
   *チャンネルを作成する
   * @param channelData 作成するチャンネルのデータ
   * @returns 作成したチャンネルデータ
   */
  @Post()
  async createChannel(@Body() channelData: createChannelRequestDto): Promise<CreatedResponse> {
    let channel: ChannelResponseDto;

    channel = await this._channelService.createChannel(channelData);
    return new CreatedResponse(channel);
  }
}
