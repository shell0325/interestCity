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
import { registerGenreRequestDto } from '../genre/dto/register-genre.request.dto';
import { GenreService } from '../genre/genre.service';
import { editUserDataRequestDto } from '../user/dto/edit-user-data.request.dto';
import { registerProfileImageRequestDto } from '../user/dto/register-profileImage.request.dto';
import { UserService } from '../user/user.service';
import { ChannelService } from './channel.service';
import { editCommentRequestDto } from './dto/edit-comment.request.dto';
import { findBookmarkRequestDto } from './dto/find-bookmark.request.dto';
import { joinChannelRequestDto } from './dto/join-channel.request.dto';
import { sendThreadCommentRequestDto } from './dto/send-thread-comment.dto';
import { toggleBookmarkRequestDto } from './dto/toggle-bookmark.request.dto';
import { toggleLikeRequestDto } from './dto/toggle-like.request.dto';
import { registerPictureRequestDto } from './dto/register-picture.request.dto';
import { sendCommentRequestDto } from './dto/send-comment.request.dto';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class ChannelGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly _channelService: ChannelService,
    private readonly _genreService: GenreService,
    private readonly _userService: UserService,
  ) {}

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('findChannel')
  async findChannel(client: Socket, genreId: number) {
    const channels = await this._channelService.findChannel(genreId);
    this.server.emit('channelData', channels.channels);
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
  async sendComments(socket: Socket, @MessageBody() commentData: sendCommentRequestDto) {
    const comment = await this._channelService.sendComment(commentData);
    this.server.emit('sendCommentData', comment.comment);
  }

  @SubscribeMessage('sendPicture')
  async sendPicture(client: Socket, file: any) {
    const sendPicture = await this._channelService.sendPicture(file[0], file[1]);
    this.server.emit('sendPictureData', sendPicture);
  }

  @SubscribeMessage('registerCommentPicture')
  async registerCommentPicture(client: Socket, pictureData: registerPictureRequestDto) {
    const editProfileData = await this._channelService.registerPicturePath(pictureData);
    this.server.emit('registerPictureData', editProfileData);
  }

  @SubscribeMessage('getChannelComments')
  async requestChannelComments(socket: Socket, channelId: number) {
    const comments = await this._channelService.getChannelComments(channelId);
    this.server.emit('channelCommentsData', comments.comments);
  }

  @SubscribeMessage('editComment')
  async editComment(client: Socket, editCommentData: editCommentRequestDto) {
    const comment = await this._channelService.editComment(editCommentData);
    this.server.emit('editCommentData', comment);
  }

  @SubscribeMessage('deleteComment')
  async deleteComment(client: Socket, master_commentId: number) {
    const deleteComments = await this._channelService.deleteComment(master_commentId);
    this.server.emit('deleteCommentData', deleteComments);
  }

  @SubscribeMessage('toggleLike')
  async toggleLike(client: Socket, toggleLikeData: toggleLikeRequestDto) {
    const likesCount = await this._channelService.toggleLike(toggleLikeData);
    this.server.emit('toggleLikeData', likesCount);
  }

  @SubscribeMessage('toggleBookmark')
  async toggleBookmark(client: Socket, toggleBookmarkData: toggleBookmarkRequestDto) {
    const toggleBookmark = await this._channelService.toggleBookmark(toggleBookmarkData);
    this.server.emit('toggleBookmarkData', toggleBookmark);
  }

  @SubscribeMessage('findBookmarkComment')
  async findBookmarkComment(client: Socket, findBookmarkData: findBookmarkRequestDto) {
    const toggleBookmark = await this._channelService.findBookmarkComments(findBookmarkData);
    this.server.emit('bookmarkCommentData', toggleBookmark.bookmarks);
  }

  @SubscribeMessage('sendThreadComment')
  async sendThreadComment(client: Socket, threadCommentData: sendThreadCommentRequestDto) {
    const subComment = await this._channelService.sendThreadComment(threadCommentData);
    this.server.emit('sendThreadCommentData', subComment);
  }

  @SubscribeMessage('findThreadComment')
  async findThreadComment(client: Socket, master_commentId: number) {
    const subComment = await this._channelService.findThreadComment(master_commentId);
    this.server.emit('threadCommentData', subComment);
  }

  @SubscribeMessage('findGenre')
  async findGenre(client: Socket, userId: number) {
    const genre = await this._genreService.findGenre(userId);
    this.server.emit('genreData', genre.usersGenres);
  }

  @SubscribeMessage('editUserProfile')
  async editUserProfile(client: Socket, editUserData: editUserDataRequestDto) {
    const findUser = await this._userService.editUserProfile(editUserData);
    this.server.emit('editUserData', findUser);
  }

  @SubscribeMessage('registerProfileImage')
  async registerProfileImage(client: Socket, file: any) {
    const registerProfileImage = await this._userService.addAvatar(file[0], file[1]);
    this.server.emit('registerProfileImageData', registerProfileImage);
  }

  @SubscribeMessage('editUserProfileImage')
  async editUserProfileImage(client: Socket, profileImageData: registerProfileImageRequestDto) {
    const editProfileData = await this._userService.registerProfileImage(profileImageData);
    console.log(editProfileData);
    this.server.emit('registerPictureData', editProfileData);
  }

  @SubscribeMessage('deleteProfileImage')
  async deleteProfileImage(client: Socket, email: string) {
    const deleteProfileImage = await this._userService.deleteProfileImage(email);
    this.server.emit('deleteProfileImageData', deleteProfileImage);
  }

  @SubscribeMessage('findUserProfile')
  async findUserProfile(client: Socket, userId: number) {
    const userProfile = await this._userService.findUserProfile(userId);
    this.server.emit('userProfile', userProfile.user);
  }

  @SubscribeMessage('registerGenre')
  async registerGenre(client: Socket, registerData: registerGenreRequestDto) {
    const genre = await this._genreService.registerGenre(registerData);
    this.server.emit('registerData', genre.usersGenres);
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
