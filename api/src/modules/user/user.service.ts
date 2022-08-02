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
import { S3 } from 'aws-sdk';
import { registerProfileImageRequestDto } from './dto/register-profileImage.request.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly _mailerService: MailerService,
    private readonly _fileService: FileUploadService,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  //user全件取得処理
  async getUsers(): Promise<UsersResponseDto> {
    const users = await this._userRepository.find();
    if (!users) throw new NotFoundException();
    return { users };
  }

  //user作成処理
  async createUser(userData: createUserRequestDto): Promise<{ user: string } | UserResponseDto> {
    //emailが使用可能かどうか確認
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
    //passwordをハッシュ化
    userData.password = this.getPasswordHash(userData.password);
    //新規ユーザーの保存
    const user = await this._userRepository.save(userData);
    const registerUser = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };
    this.sendEmail(registerUser);
    return { user: '会員登録メールを送信しました' };
  }

  async getCertificationUser(email: string): Promise<UserResponseDto> {
    const user = await this._userRepository.findOne({
      where: { email: email, certification: true },
    });
    if (!user) throw new NotFoundException();
    return { user };
  }

  async certificationUser(userData: certificationUserRequestDto) {
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

  async findCertificationUser(id: number): Promise<UsersResponseDto> {
    const users = await this._userRepository.find({ where: { id: id } });
    if (!users) throw new NotFoundException();
    return { users };
  }

  //user取得処理
  async findUser(email: string): Promise<UserResponseDto> {
    //emailを使用してユーザーを特定
    const user = await this._userRepository.findOne({ where: { email: email } });
    if (!user) throw new NotFoundException();
    return { user };
  }

  //passwordハッシュ化処理
  getPasswordHash(password: string): string {
    const saltRounds: number = 10;
    const salt: string = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }

  //userProfile編集処理
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

  //userProfile取得処理
  async findUserProfile(id: number): Promise<UserResponseDto> {
    const user = await this._userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    return { user };
  }

  //メール送信処理
  async sendEmail(userData: sendEmailRequestDto): Promise<void> {
    const now = new Date();
    const expiration = await now.setHours(now.getHours() + 1);

    const emailHash = await bcrypt.hash(userData.email, 10);

    const hash = emailHash.replace('/', '');
    const url =
      'http://localhost:8080/register/_' + userData.userId + '/' + hash + '?expires=' + expiration;

    this._mailerService.sendMail({
      to: userData.email,
      from: process.env.EMAIL_USER,
      subject: 'ユーザー本登録用URL',
      html: '<b>以下のURLをクリックして本登録を完了させてください。\n\n</b>' + url,
    });
  }

  async  registerProfileImage(
    registerProfileImageData: registerProfileImageRequestDto,
  ): Promise<UserResponseDto> {
    const email = registerProfileImageData.email;
    const profileImagePath = registerProfileImageData.profileImagePath;
    const key = registerProfileImageData.key;
    const userData = await this._userRepository.findOne({ where: { email } });
    if (!userData) throw new NotFoundException();
    const user = await this._userRepository.save({
      ...userData,
      profileImagePath,
      key,
    });
    return { user };
  }

  async deleteProfileImage(email: string) {
    const s3 = new S3();
    const userData = await this._userRepository.find({ where: { email } });
    if (userData[0].key === null) {
      return email;
    }
    if (userData[0].key !== '' && userData[0].key !== null) {
      const deleteResult = await s3
        .deleteObject({
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME!,
          Key: userData[0].key,
        })
        .promise();
      return deleteResult;
    }
    return userData;
  }

  async addAvatar(imageBuffer: Buffer, filename: string) {
    const avatar = await this._fileService.uploadPublicFile(imageBuffer, filename);
    return avatar;
  }
}
