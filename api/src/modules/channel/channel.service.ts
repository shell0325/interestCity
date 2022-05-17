import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from 'src/database/entities/bookmarks.entity';
import { Channel } from 'src/database/entities/channels.entity';
import { Like } from 'src/database/entities/likes.entity';
import { Master_Comment } from 'src/database/entities/master_comments.entity';
import { Sub_Comment } from 'src/database/entities/sub_comments.entity';
import { Users_Channels } from 'src/database/entities/users_channels.entity';
import { DeleteResult, Repository } from 'typeorm';
import { BookmarkResponseDto } from './dto/bookmark.response.dto';
import { BookmarksResponseDto } from './dto/bookmarks.response.dto';
import { ChannelResponseDto } from './dto/channel.response.dto';
import { ChannelsResponseDto } from './dto/channels.response.dto';
import { CommentResponseDto } from './dto/comment.response.dto';
import { CommentsResponseDto } from './dto/comments.response.dto';
import { createChannelRequestDto } from './dto/create-channel.request.dto';
import { editCommentRequestDto } from './dto/edit-comment.request.dto';
import { findBookmarkRequestDto } from './dto/find-bookmark.request.dto';
import { joinChannelRequestDto } from './dto/join-channel.request.dto';
import { LikeResponseDto } from './dto/like.response.dto';
import { postThreadCommentRequestDto } from './dto/post-thread-comment.dto';
import { bookmarkCommentRequestDto } from './dto/register-bookmark-comment.request.dto';
import { likesCommentRequestDto } from './dto/register-likes-comment.request.dto';
import { sendCommentRequestDto } from './dto/sendComment.request.dto';
import { SubCommentResponseDto } from './dto/sub-comment.response.dto';
import { UsersChannelResponseDto } from './dto/user-channel.response.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly _channelRepository: Repository<Channel>,
    @InjectRepository(Users_Channels)
    private readonly _usersChannelsRepository: Repository<Users_Channels>,
    @InjectRepository(Master_Comment)
    private readonly _masterCommentRepository: Repository<Master_Comment>,
    @InjectRepository(Like)
    private readonly _likesRepository: Repository<Like>,
    @InjectRepository(Bookmark)
    private readonly _bookmark: Repository<Bookmark>,
    @InjectRepository(Sub_Comment)
    private readonly _subComment: Repository<Sub_Comment>,
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
    return { channel: channel, users_channels: registerUsers_Channels };
  }

  async findChannel(genreId: number): Promise<ChannelsResponseDto> {
    const channels = await this._channelRepository.find({
      where: {
        genreId: genreId,
      },
      relations: ['user', 'tag'],
    });
    channels.sort((a, b) => a.id - b.id);
    return { channels };
  }

  async joinChannel(joinChannelData: joinChannelRequestDto): Promise<UsersChannelResponseDto> {
    const users_channels = await this._usersChannelsRepository.save(joinChannelData);
    return { users_channels };
  }

  async exitChannel(exitChannelId: number): Promise<DeleteResult> {
    const exitChannel = await this._usersChannelsRepository.delete({ channelId: exitChannelId });
    return exitChannel;
  }

  async sendComment(commentData: sendCommentRequestDto): Promise<CommentResponseDto> {
    const comment = await this._masterCommentRepository.save(commentData);
    return { comment };
  }

  async getChannelComments(channelId: number): Promise<CommentsResponseDto> {
    const comments = await this._masterCommentRepository.find({
      where: {
        channelId: channelId,
      },
      relations: ['user', 'likes', 'bookmark'],
    });
    comments.sort((a, b) => a.id - b.id);
    return { comments };
  }

  async editComment(editCommentData: editCommentRequestDto): Promise<CommentResponseDto> {
    const origin = await this._masterCommentRepository.find({
      where: {
        id: editCommentData.master_commentId,
      },
    });
    if (!origin) {
      throw new NotFoundException('コメントが見つかりません');
    }
    const updateCommentData = Object.assign(origin[0], {
      comment: editCommentData.comment,
    });
    const comment = await this._masterCommentRepository.save(updateCommentData);
    return { comment };
  }

  async deleteComment(master_commentId: number): Promise<DeleteResult> {
    const deleteComments = await this._masterCommentRepository.delete({
      id: master_commentId,
    });
    return deleteComments;
  }

  async likesComment(
    likesCountData: likesCommentRequestDto,
  ): Promise<DeleteResult | LikeResponseDto> {
    const likesComment = await this._likesRepository.find({
      where: {
        master_commentId: likesCountData.master_commentId,
        userId: likesCountData.userId,
      },
    });
    if (likesComment.length !== 0) {
      const deleteLikes = await this._likesRepository.delete({
        master_commentId: likesCountData.master_commentId,
        userId: likesCountData.userId,
      });
      return deleteLikes;
    } else {
      const like = await this._likesRepository.save(likesCountData);
      return { like };
    }
  }

  async bookmarkComment(
    bookmarkCommentData: bookmarkCommentRequestDto,
  ): Promise<DeleteResult | BookmarkResponseDto> {
    const bookmarkComment = await this._bookmark.find({
      where: {
        master_commentId: bookmarkCommentData.master_commentId,
        userId: bookmarkCommentData.userId,
      },
    });
    if (bookmarkComment.length !== 0) {
      const deleteLikes = await this._bookmark.delete({
        master_commentId: bookmarkCommentData.master_commentId,
        userId: bookmarkCommentData.userId,
      });
      return deleteLikes;
    } else {
      const bookmark = await this._bookmark.save(bookmarkCommentData);
      return { bookmark };
    }
  }

  async findBookmarkComments(
    findBookmarkData: findBookmarkRequestDto,
  ): Promise<BookmarksResponseDto> {
    const bookmarks = await this._bookmark.find({
      where: {
        genreId: findBookmarkData.genreId,
        userId: findBookmarkData.userId,
      },
      relations: ['master_comment', 'user'],
    });
    return { bookmarks };
  }

  async postThreadComment(
    subCommentData: postThreadCommentRequestDto,
  ): Promise<SubCommentResponseDto> {
    const subComment = await this._subComment.save(subCommentData);
    return { subComment };
  }
}
