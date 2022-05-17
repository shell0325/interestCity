import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelService } from './channel.service';
import { joinChannelRequestDto } from './dto/join-channel.request.dto';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class ChannelGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly _channelService: ChannelService) {}

  @SubscribeMessage('findChannel')
  async findChannel(client: Socket, genreId: number) {
    const channels = await this._channelService.findChannel(genreId);
    this.server.emit('channelData', channels);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, joinChannelData: joinChannelRequestDto) {
    const joinChannel = await this._channelService.joinChannel(joinChannelData);
    this.server.emit('joinChannelData', joinChannel);
  }

  @SubscribeMessage('exitChannel')
  async exitChannel(client: Socket, exitChannelId: number) {
    const exitChannel = await this._channelService.exitChannel(exitChannelId);
    this.server.emit('exitChannelData', exitChannel);
  }

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('起動しました');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
