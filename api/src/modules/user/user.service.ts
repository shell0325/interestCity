import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UsersResponseDto } from './dto/users.response.dto';
import { createUserRequestDto } from './dto/create-user.request.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { IUserService } from './interface/user-service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
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
  async createUser(userData: createUserRequestDto): Promise<UserResponseDto> {
    //emailが使用可能かどうか確認
    const findUser = await this._userRepository.findOne({ where: { email: userData.email } });
    if (findUser) {
      throw new BadRequestException('このメールアドレスは使用されています');
    }
    //passwordをハッシュ化
    userData.password = this.getPasswordHash(userData.password);
    //新規ユーザーの保存
    const user = await this._userRepository.save(userData);
    return { user };
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
}
