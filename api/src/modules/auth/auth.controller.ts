import { Body, Controller, Get, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { User } from 'src/database/entities/users.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

type PasswordOmitUser = Omit<User, 'password'>;

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  /**
   * passport-local戦略を付与する
   * @param user パスワード以外のユーザーデータ
   * @returns ログイン
   */
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body(ValidationPipe) user: PasswordOmitUser): Promise<{
    access_token: string;
    user: PasswordOmitUser;
  }> {
    return this._authService.login(user);
  }

  /**
   * JWT認証
   * @param req パスワード以外のユーザーデータ
   * @returns 認証成功したユーザーデータ
   */
  @UseGuards(JwtAuthGuard) // passport-jwt戦略を付与する
  @Get('/profile')
  async getProfile(@Request() req: { user: PasswordOmitUser }): Promise<PasswordOmitUser> {
    const token = await this._authService.getToken(req.user);
    return req.user;
  }
}
