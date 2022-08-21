import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UsersResponseDto } from './dto/users.response.dto';
import { createUserRequestDto } from './dto/create-user.request.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { IUserService } from './interface/user-service.interface';
import { editUserDataRequestDto } from './dto/edit-user-data.request.dto';
import { sendEmailRequestDto } from './dto/send-email.request.dto';
import { certificationUserRequestDto } from './dto/certification-user.request.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { FileUploadService } from '../file-upload/file-upload.service';
import { AWSError, S3 } from 'aws-sdk';
import { editUserProfileRequestDto } from './dto/edit-user-profile.request.dto';
import { PromiseResult } from 'aws-sdk/lib/request';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly _mailerService: MailerService,
    private readonly _fileService: FileUploadService,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  /**
   *全ユーザーのデータを取得する
   * @returns 全ユーザーデータ
   */
  async getUsers(): Promise<UsersResponseDto> {
    const users = await this._userRepository.find();
    if (!users) throw new NotFoundException();
    return { users };
  }

  /**
   *ユーザーを作成する
   * @param userData 作成するユーザーデータ
   * @returns 作成したユーザーデータ
   */
  async createUser(userData: createUserRequestDto): Promise<{ user: string } | UserResponseDto> {
    const findUser = await this._userRepository.find({ where: { email: userData.email } });
    if (findUser.length !== 0) {
      if (findUser[0].certification === false) {
        const sendEmailUser = {
          userId: findUser[0].id,
          username: findUser[0].username,
          email: findUser[0].email,
        };
        this.sendEmail(sendEmailUser);
        return { user: '会員登録メールを送信しました' };
      } else if (findUser[0].certification === true) {
      }
      return { user: 'このメールアドレスは使用されています' };
    }
    userData.password = this.getPasswordHash(userData.password);
    const user = await this._userRepository.save(userData);
    const registerUser = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };
    this.sendEmail(registerUser);
    return { user: '会員登録メールを送信しました' };
  }

  /**
   *本登録済みのユーザーを取得する
   * @param email メールアドレス
   * @returns 登録済みの全ユーザーデータ
   */
  async getCertificationUser(email: string): Promise<UserResponseDto> {
    const user = await this._userRepository.findOne({
      where: { email: email, certification: true },
    });
    if (!user) throw new NotFoundException();
    return { user };
  }

  /**
   *ユーザーを本登録する
   * @param userData 本登録するユーザーデータ
   * @returns 本登録後のユーザーデータ
   */
  async certificationUser(userData: certificationUserRequestDto): Promise<UserResponseDto> {
    const userProfile = await this._userRepository.find({
      where: {
        id: userData.userId,
      },
    });
    if (!userProfile) {
      throw new NotFoundException('ユーザーが見つかりません');
    }

    const certificationUser = Object.assign(userProfile[0], {
      certification: userData.certification,
    });
    const user = await this._userRepository.save(certificationUser);
    return { user };
  }

  /**
   *本登録済みのユーザーを検索する
   * @param userId ユーザーID
   * @returns 本登録済みのユーザーデータ
   */
  async findCertificationUser(id: number): Promise<UsersResponseDto> {
    const users = await this._userRepository.find({ where: { id: id } });
    if (!users) throw new NotFoundException();
    return { users };
  }

  /**
   *ユーザーを検索する
   * @param email メールアドレス
   * @returns メールアドレスで検索したユーザーデータ
   */
  async findUser(email: string): Promise<UserResponseDto> {
    const user = await this._userRepository.findOne({ where: { email: email } });
    if (!user) throw new NotFoundException();
    return { user };
  }

  /**
   *ハスワードをハッシュ化する
   * @param password パスワード
   * @returns ハッシュ後のパスワード
   */
  getPasswordHash(password: string): string {
    const saltRounds: number = 10;
    const salt: string = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }

  /**
   *ユーザーのプロフィール写真を編集する
   * @param editUserData 編集するユーザーのデータ
   * @returns 編集後のユーザーデータ
   */
  async editUserProfile(editUserData: editUserDataRequestDto): Promise<UserResponseDto> {
    const editUser = await this._userRepository.find({
      where: {
        id: editUserData.userId,
      },
    });
    if (!editUser) {
      throw new NotFoundException('ユーザーが見つかりません');
    }
    const updateUser = Object.assign(editUser[0], {
      username: editUserData.username,
      self_introduction: editUserData.self_introduction,
    });
    const user = await this._userRepository.save(updateUser);
    return { user };
  }

  /**
   *ユーザーを検索する
   * @param id ユーザーID
   * @returns ユーザーIDで検索したユーザーデータ
   */
  async findUserProfile(id: number): Promise<UserResponseDto> {
    const user = await this._userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    return { user };
  }

  /**
   *本登録用のメールを送信する
   * @param userData 本登録メールを送信するユーザーのデータ
   * @returns 送信した本登録用のURL
   */
  async sendEmail(userData: sendEmailRequestDto): Promise<String> {
    const now = new Date();
    const expiration = await now.setHours(now.getHours() + 1);

    const emailHash = await bcrypt.hash(userData.email, 10);

    const hash = emailHash.replace('/', '');
    const url =
      `http://${process.env.HOST!}:${process.env.FRONT_PORT!}/register/_` +
      userData.userId +
      '/' +
      hash +
      '?expires=' +
      expiration;

    this._mailerService.sendMail({
      to: userData.email,
      from: process.env.EMAIL_USER,
      subject: 'ユーザー本登録用URL',
      html:
        '<p>以下のURLをクリックして本登録を完了させてください。</p>' +
        url +
        '<p>ご注意</p>' +
        '<p>・有効期限はメールが送信されてから1時間です。</p>' +
        '<p>・有効期限が切れた場合は再度ユーザー登録をしてください。</p>' +
        '<p></p>' +
        '<p>※本メールは送信専用です。このままご返信いただいてもお答えできませんのでご了承ください。</p>',
    });
    return url;
  }

  /**
   *ユーザーデータを編集する
   * @param registerProfileImageData 編集するユーザーのデータ
   * @returns 編集後のユーザーデータ
   */
  async editUser(registerProfileImageData: editUserProfileRequestDto): Promise<UserResponseDto> {
    const email = registerProfileImageData.email;
    const editUserData = {
      userId: registerProfileImageData.userId,
      username: registerProfileImageData.username,
      self_introduction: registerProfileImageData.self_introduction,
    };
    const userData = await this._userRepository.find({ where: { email } });
    if (
      registerProfileImageData.profileImagePath !== '' &&
      registerProfileImageData.fileName !== ''
    ) {
      const ImagePath = registerProfileImageData.profileImagePath;
      const fileName = registerProfileImageData.fileName;
      if (userData[0].profileImagePath !== '') {
        await this.deleteProfileImage(email);
      }
      const addAvatar = await this.addAvatar(ImagePath, fileName);
      const profileImagePath = addAvatar.Location;
      const key = addAvatar.Key;
      await this.editUserProfile(editUserData);
      const userProfile = await this._userRepository.find({ where: { email } });
      const user = await this._userRepository.save({
        ...userProfile[0],
        profileImagePath,
        key,
      });
      return { user };
    }
    await this.deleteProfileImage(email);
    const profileImagePath = '';
    const key = '';
    await this.editUserProfile(editUserData);
    const userProfile = await this._userRepository.find({ where: { email } });
    const user = await this._userRepository.save({
      ...userProfile[0],
      profileImagePath,
      key,
    });
    return { user };
  }

  /**
   *登録済みのユーザープロフィール写真を削除する
   * @param email メールアドレス
   * @returns プロフィール写真の削除データ
   */
  async deleteProfileImage(
    email: string,
  ): Promise<UsersResponseDto | PromiseResult<S3.DeleteObjectOutput, AWSError>> {
    const s3 = new S3();
    const users = await this._userRepository.find({ where: { email } });
    if (users[0].key === null) {
      return { users };
    } else if (users[0].key !== '' && users[0].key !== null) {
      const deleteResult = await s3
        .deleteObject({
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME!,
          Key: users[0].key,
        })
        .promise();
      return deleteResult;
    }
    return { users };
  }

  /**
   *ファイルをアップロードする
   * @param imageBuffer アップロードするファイルのバッファーデータ
   * @param filename アップロードするファイルの名前
   * @returns アップロード後のファイルデータ
   */
  async addAvatar(imageBuffer: Buffer, filename: string): Promise<S3.ManagedUpload.SendData> {
    const avatar = await this._fileService.uploadPublicFile(imageBuffer, filename);
    return avatar;
  }
}
