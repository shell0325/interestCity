import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from 'src/database/entities/bookmarks.entity';
import { Channel } from 'src/database/entities/channels.entity';
import { Like } from 'src/database/entities/likes.entity';
import { Master_Comment } from 'src/database/entities/master_comments.entity';
import { Sub_Comment } from 'src/database/entities/sub_comments.entity';
import { Users_Channels } from 'src/database/entities/users_channels.entity';
import { DeleteResult, Repository } from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
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
import { registerPictureRequestDto } from './dto/registerPicture.request.dto';
import { sendCommentRequestDto } from './dto/sendComment.request.dto';
import { SubCommentResponseDto } from './dto/sub-comment.response.dto';
import { SubCommentsResponseDto } from './dto/sub-comments.response.dto';
import { UsersChannelResponseDto } from './dto/user-channel.response.dto';
import { S3 } from 'aws-sdk';

@Injectable()
export class ChannelService {
  constructor(
    private readonly _fileService: FileUploadService,
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
    const commentsData = {
      comment: commentData.comment,
      channelId: commentData.channelId,
      userId: commentData.userId,
      postImage: commentData.postImage,
      pictureName: commentData.pictureName,
    };
    if (commentData.postImage !== '') {
      const comment = await this._masterCommentRepository.save(commentsData);
      const postPicture = await this.sendPicture(commentData.postImage, commentData.pictureName);
      const registerPictureData = {
        commentId: comment.id,
        picture: postPicture.Location,
        key: postPicture.Key,
      };
      const registerPicture = await this.registerPicturePath(registerPictureData);
      return { comment };
    }
    const comment = await this._masterCommentRepository.save(commentsData);
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

  async deleteComment(master_commentId: number) {
    const s3 = new S3();
    const comment = await this._masterCommentRepository.find({
      id: master_commentId,
    });
    if (comment[0].picture !== null) {
      const deleteResult = await s3
        .deleteObject({
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME!,
          Key: comment[0].key,
        })
        .promise();
      const deleteComments = await this._masterCommentRepository.delete({
        id: master_commentId,
      });
      return deleteComments;
    }
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

  async findThreadComment(master_commentId: number): Promise<SubCommentsResponseDto> {
    const subComment = await this._subComment.find({
      where: {
        master_commentId: master_commentId,
      },
      relations: ['user', 'master_comment'],
    });
    return { subComment };
  }

  async sendPicture(imageBuffer: Buffer, filename: string) {
    const picture = await this._fileService.uploadPublicFile(imageBuffer, filename);
    return picture;
  }

  async registerPicturePath(pictureData: registerPictureRequestDto) {
    const picture = pictureData.picture;
    const key = pictureData.key;
    const comment = await this._masterCommentRepository.findOne({
      where: { id: pictureData.commentId },
    });
    if (!comment) throw new NotFoundException();
    const master_comment = await this._masterCommentRepository.save({
      ...comment,
      picture,
      key,
    });
    return master_comment;
  }
}
