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
import { UserService } from './user.service';

@WebSocketGateway({
  namespace: '/user',
  cors: {
    origin: '*',
  },
})
export class UserGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly _userService: UserService) {}

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('findCertificationUser')
  async findCertificationUser(socket: Socket, id: number) {
    const user = await this._userService.findCertificationUser(id);
    this.server.emit('userData', user);
  }

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
