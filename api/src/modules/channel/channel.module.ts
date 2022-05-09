import { Module } from '@nestjs/common';
import { Gateway } from './.gateway';
import { ChannelGateway } from './channel.gateway';

@Module({
  providers: [Gateway, ChannelGateway]
})
export class ChannelModule {}
