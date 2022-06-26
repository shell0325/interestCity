import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/entities/users.entity';
import { UserService } from '../user/user.service';
import { IAuthService } from './interface/auth-service.interface';

type PasswordOmitUser = Omit<User, 'password'>;

interface JWTPayload {
  id: User['id'];
  username: User['username'];
  email: User['email'];
  certification: User['certification'];
  self_Introduction: User['self_introduction'];
  profileImage: User['profileImagePath'];
  created_at: User['createdAt'];
  updated_at: User['updatedAt'];
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<PasswordOmitUser> {
    const user = await this._userService.getCertificationUser(email);
    const isValid = await bcrypt.compareSync(password, user.user.password);
    if (!user || !isValid) {
      throw new NotFoundException();
    } else {
      const { password, ...result } = user.user;
      return result;
    }
  }

  async login(user: PasswordOmitUser): Promise<{
    access_token: string;
    user: PasswordOmitUser;
  }> {
    const payload: JWTPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      certification:user.certification,
      self_Introduction: user.self_introduction,
      profileImage: user.profileImagePath,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };

    return {
      access_token: `Bearer ${this._jwtService.sign(payload)}`,
      user: user,
    };
  }

  async getToken(user: PasswordOmitUser): Promise<{
    tokenVarify: PasswordOmitUser;
    token: string;
  }> {
    const payload: JWTPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      certification:user.certification,
      self_Introduction: user.self_introduction,
      profileImage: user.profileImagePath,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };

    const token = await this._jwtService.signAsync(payload);

    const tokenVarify: PasswordOmitUser = await this._jwtService.verify(token);

    return {
      tokenVarify: tokenVarify,
      token: token,
    };
  }
}
