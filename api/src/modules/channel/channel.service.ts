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
import { sendThreadCommentRequestDto } from './dto/send-thread-comment.dto';
import { toggleBookmarkRequestDto } from './dto/toggle-bookmark.request.dto';
import { toggleLikeRequestDto } from './dto/toggle-like.request.dto';
import { registerPictureRequestDto } from './dto/register-picture.request.dto';
import { sendCommentRequestDto } from './dto/send-comment.request.dto';
import { SubCommentResponseDto } from './dto/sub-comment.response.dto';
import { SubCommentsResponseDto } from './dto/sub-comments.response.dto';
import { UsersChannelResponseDto } from './dto/user-channel.response.dto';
import { S3 } from 'aws-sdk';
import { IChannelService } from './interface/channel-service.interface';

@Injectable()
export class ChannelService implements IChannelService {
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

  /**
   *チャンネルを作成する
   * @param channelData チャンネル作成用のデータ
   * @returns 作成したチャンネルのデータ
   */
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
    const joinChannel = await this._usersChannelsRepository.save(joinChannelData);
    return { channel: channel, users_channels: joinChannel };
  }

  /**
   *ジャンルごとのチャンネルを検索する
   * @param genreId ジャンルID
   * @returns ジャンルごとのチャンネルデータ
   */
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

  /**
   *チャンネルを参加する
   * @param joinChannelData チャンネル参加用のデータ
   * @returns 参加したチャンネルデータ
   */
  async joinChannel(joinChannelData: joinChannelRequestDto): Promise<UsersChannelResponseDto> {
    const users_channels = await this._usersChannelsRepository.save(joinChannelData);
    return { users_channels };
  }

  /**
   *チャンネルを退出する
   * @param exitChannelId チャンネルID
   * @returns 退出したチャンネルデータ
   */
  async exitChannel(exitChannelId: number): Promise<DeleteResult> {
    const exitChannel = await this._usersChannelsRepository.delete({ channelId: exitChannelId });
    return exitChannel;
  }

  /**
   *コメントを送信する
   * @param commentData 送信するコメントのデータ
   * @returns 送信したコメントデータ
   */
  async sendComment(commentData: sendCommentRequestDto): Promise<CommentResponseDto> {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const hour = today.getHours() + 9;
    const minute = today.getMinutes();
    const postTime = `${month}月${day}日${hour}時${minute}分`;
    const commentsData = {
      comment: commentData.comment,
      channelId: commentData.channelId,
      userId: commentData.userId,
      sendImage: commentData.sendImage,
      pictureName: commentData.pictureName,
      time: postTime,
    };
    if (commentData.sendImage !== '') {
      const comment = await this._masterCommentRepository.save(commentsData);
      const sendPictureData = await this.sendPicture(
        commentData.sendImage,
        commentData.pictureName,
      );
      const registerPictureData = {
        commentId: comment.id,
        picture: sendPictureData.Location,
        key: sendPictureData.Key,
      };
      await this.registerPicturePath(registerPictureData);
      return { comment };
    }
    const comment = await this._masterCommentRepository.save(commentsData);
    return { comment };
  }

  /**
   *チャンネルごとのコメントを取得する
   * @param channelId チャンネルID
   * @returns チャンネルのコメントデータ
   */
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

  /**
   *コメントを編集する
   * @param editCommentData 編集するコメントのデータ
   * @returns 編集後のコメントデータ
   */
  async editComment(editCommentData: editCommentRequestDto): Promise<CommentResponseDto> {
    const editComment = await this._masterCommentRepository.find({
      where: {
        id: editCommentData.master_commentId,
      },
    });
    if (!editComment) {
      throw new NotFoundException('コメントが見つかりません');
    }
    const updateCommentData = Object.assign(editComment[0], {
      comment: editCommentData.comment,
    });
    const comment = await this._masterCommentRepository.save(updateCommentData);
    return { comment };
  }

  /**
   *コメントを削除する
   * @param master_commentId コメントID
   * @returns 削除したコメントデータ
   */
  async deleteComment(master_commentId: number): Promise<DeleteResult> {
    const s3 = new S3();
    const comment = await this._masterCommentRepository.find({
      id: master_commentId,
    });
    if (comment[0].picture !== null) {
      await s3
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

  /**
   *いいねを切り替える
   * @param toggleLikeData 切り替えるいいねのデータ
   * @returns 切り替えたいいねデータ
   */
  async toggleLike(toggleLikeData: toggleLikeRequestDto): Promise<DeleteResult | LikeResponseDto> {
    const toggleLike = await this._likesRepository.find({
      where: {
        master_commentId: toggleLikeData.master_commentId,
        userId: toggleLikeData.userId,
      },
    });
    if (toggleLike.length !== 0) {
      const deleteLikes = await this._likesRepository.delete({
        master_commentId: toggleLikeData.master_commentId,
        userId: toggleLikeData.userId,
      });
      return deleteLikes;
    } else {
      const like = await this._likesRepository.save(toggleLikeData);
      return { like };
    }
  }

  /**
   *ブックマークを切り替える
   * @param toggleBookmarkData 切り替えるブックマークのデータ
   * @returns 切り替えたブックマークデータ
   */
  async toggleBookmark(
    toggleBookmarkData: toggleBookmarkRequestDto,
  ): Promise<DeleteResult | BookmarkResponseDto> {
    const toggleBookmark = await this._bookmark.find({
      where: {
        master_commentId: toggleBookmarkData.master_commentId,
        userId: toggleBookmarkData.userId,
      },
    });
    if (toggleBookmark.length !== 0) {
      const deleteLikes = await this._bookmark.delete({
        master_commentId: toggleBookmarkData.master_commentId,
        userId: toggleBookmarkData.userId,
      });
      return deleteLikes;
    } else {
      const bookmark = await this._bookmark.save(toggleBookmarkData);
      return { bookmark };
    }
  }

  /**
   *ブックマーク中のコメントを取得する
   * @param findBookmarkData 登録中のブックマークを探すためのデータ
   * @returns 登録中のブックマークデータ
   */
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

  /**
   *スレッドコメントを送信する
   * @param subCommentData 送信するスレッドコメントのデータ
   * @returns 送信したスレッドコメントデータ
   */
  async sendThreadComment(
    subCommentData: sendThreadCommentRequestDto,
  ): Promise<SubCommentResponseDto> {
    const today = new Date();
    const hour = today.getHours();
    const minute = today.getMinutes();
    const postTime = `${hour}時${minute}分`;
    const subCommentsData = {
      comment: subCommentData.comment,
      userId: subCommentData.userId,
      master_commentId: subCommentData.master_commentId,
      time: postTime,
    };

    const subComment = await this._subComment.save(subCommentsData);
    return { subComment };
  }

  /**
   *コメントごとのスレッドコメントを取得する
   * @param master_commentId コメントID
   * @returns コメントごとのスレッドコメントデータ
   */
  async findThreadComment(master_commentId: number): Promise<SubCommentsResponseDto> {
    const subComment = await this._subComment.find({
      where: {
        master_commentId: master_commentId,
      },
      relations: ['user', 'master_comment'],
    });
    return { subComment };
  }

  /**
   *ファイルを送信する
   * @param imageBuffer アップロードするファイルのバッファーデータ
   * @param filename アップロードするファイルの名前
   * @returns アップロードしたファイルデータ
   */
  async sendPicture(imageBuffer: Buffer, filename: string): Promise<S3.ManagedUpload.SendData> {
    const picture = await this._fileService.uploadPublicFile(imageBuffer, filename);
    return picture;
  }

  /**
   *送信したファイルのS3のパスを保存する
   * @param pictureData アップロードしたファイルのデータ
   * @returns アップロードしたファイルのコメントデータ
   */
  async registerPicturePath(pictureData: registerPictureRequestDto): Promise<CommentResponseDto> {
    const picture = pictureData.picture;
    const key = pictureData.key;
    const master_comment = await this._masterCommentRepository.find({
      where: { id: pictureData.commentId },
    });
    if (!master_comment) throw new NotFoundException();
    const registerComment = Object.assign(master_comment[0], {
      picture: picture,
      key: key,
    });
    const comment = await this._masterCommentRepository.save(registerComment);
    return { comment };
  }
}
