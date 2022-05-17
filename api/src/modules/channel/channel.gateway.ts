import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelService } from './channel.service';
import { CommentResponseDto } from './dto/comment.response.dto';
import { editCommentRequestDto } from './dto/edit-comment.request.dto';
import { joinChannelRequestDto } from './dto/join-channel.request.dto';
import { likesCommentRequestDto } from './dto/register-likes-comment.request.dto';
import { sendCommentRequestDto } from './dto/sendComment.request.dto';

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

  private logger: Logger = new Logger('AppGateway');

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

  @SubscribeMessage('sendComment')
  async sendComment(socket: Socket, @MessageBody() commentData: sendCommentRequestDto) {
    const comment = await this._channelService.sendComment(commentData);
    this.server.emit('post_message', comment);
  }

  @SubscribeMessage('request_channel_comments')
  async requestChannelComments(socket: Socket, channelId: number) {
    const comments = await this._channelService.getChannelComments(channelId);
    this.server.emit('channel_comments', comments);
  }

  @SubscribeMessage('editComment')
  async editComment(client: Socket, editCommentData: editCommentRequestDto) {
    const comment = await this._channelService.editComment(editCommentData);
    this.server.emit('commentData', comment);
  }

  @SubscribeMessage('deleteComment')
  async deleteComment(client: Socket, master_commentId: number) {
    const deleteComments = await this._channelService.deleteComment(master_commentId);
    this.server.emit('deleteCommentData', deleteComments);
  }

  @SubscribeMessage('likesComment')
  async likesComment(client: Socket, likesCommentData: likesCommentRequestDto) {
    const likesCount = await this._channelService.likesComment(likesCommentData);
    this.server.emit('likesCountData', likesCount);
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
