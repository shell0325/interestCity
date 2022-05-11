import { Strategy as BaseJwtStrategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from 'src/database/entities/users.entity';

type PasswordOmitUser = Omit<User, 'password'>;

@Injectable()
export class LocalStrategy extends PassportStrategy(BaseJwtStrategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  // passport-localは、デフォルトで email と password をパラメーターで受け取る
  async validate(email: string, password: string): Promise<PasswordOmitUser> {
    // 認証して結果を受け取る
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('認証失敗');
    } else {
      return user;
    }
  }
}
