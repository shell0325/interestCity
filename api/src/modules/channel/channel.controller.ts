import { Body, Controller, Post } from '@nestjs/common';
import { CreatedResponse } from 'src/common/types/response';
import { ChannelService } from './channel.service';
import { ChannelResponseDto } from './dto/channel.response.dto';
import { createChannelRequestDto } from './dto/create-channel.request.dto';

@Controller('channel')
export class ChannelController {
  constructor(private readonly _channelService: ChannelService) {}

  @Post()
  async createChannel(@Body() channel: createChannelRequestDto): Promise<CreatedResponse> {
    let responseData: ChannelResponseDto;
    console.log(channel);

    responseData = await this._channelService.createChannel(channel);
    return new CreatedResponse(responseData);
  }
}
