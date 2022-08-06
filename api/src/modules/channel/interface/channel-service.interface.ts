import { S3 } from 'aws-sdk';
import { DeleteResult } from 'typeorm';
import { BookmarkResponseDto } from '../dto/bookmark.response.dto';
import { BookmarksResponseDto } from '../dto/bookmarks.response.dto';
import { ChannelResponseDto } from '../dto/channel.response.dto';
import { ChannelsResponseDto } from '../dto/channels.response.dto';
import { CommentResponseDto } from '../dto/comment.response.dto';
import { CommentsResponseDto } from '../dto/comments.response.dto';
import { createChannelRequestDto } from '../dto/create-channel.request.dto';
import { editCommentRequestDto } from '../dto/edit-comment.request.dto';
import { findBookmarkRequestDto } from '../dto/find-bookmark.request.dto';
import { joinChannelRequestDto } from '../dto/join-channel.request.dto';
import { LikeResponseDto } from '../dto/like.response.dto';
import { registerPictureRequestDto } from '../dto/register-picture.request.dto';
import { sendCommentRequestDto } from '../dto/send-comment.request.dto';
import { sendThreadCommentRequestDto } from '../dto/send-thread-comment.dto';
import { SubCommentResponseDto } from '../dto/sub-comment.response.dto';
import { SubCommentsResponseDto } from '../dto/sub-comments.response.dto';
import { toggleBookmarkRequestDto } from '../dto/toggle-bookmark.request.dto';
import { toggleLikeRequestDto } from '../dto/toggle-like.request.dto';
import { UsersChannelResponseDto } from '../dto/user-channel.response.dto';

export interface IChannelService {
  createChannel(
    channelData: createChannelRequestDto,
  ): Promise<ChannelResponseDto & UsersChannelResponseDto>;
  findChannel(genreId: number): Promise<ChannelsResponseDto>;
  joinChannel(joinChannelData: joinChannelRequestDto): Promise<UsersChannelResponseDto>;
  exitChannel(exitChannelId: number): Promise<DeleteResult>;
  sendComment(commentData: sendCommentRequestDto): Promise<CommentResponseDto>;
  getChannelComments(channelId: number): Promise<CommentsResponseDto>;
  editComment(editCommentData: editCommentRequestDto): Promise<CommentResponseDto>;
  deleteComment(master_commentId: number): Promise<DeleteResult>;
  toggleLike(toggleLikeData: toggleLikeRequestDto): Promise<DeleteResult | LikeResponseDto>;
  toggleBookmark(
    toggleBookmarkData: toggleBookmarkRequestDto,
  ): Promise<DeleteResult | BookmarkResponseDto>;
  findBookmarkComments(findBookmarkData: findBookmarkRequestDto): Promise<BookmarksResponseDto>;
  sendThreadComment(subCommentData: sendThreadCommentRequestDto): Promise<SubCommentResponseDto>;
  findThreadComment(master_commentId: number): Promise<SubCommentsResponseDto>;
  sendPicture(imageBuffer: Buffer, filename: string): Promise<S3.ManagedUpload.SendData>;
  registerPicturePath(pictureData: registerPictureRequestDto): Promise<CommentResponseDto>;
}
