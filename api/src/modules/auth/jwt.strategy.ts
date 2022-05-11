import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as BaseJwtStrategy } from 'passport-jwt';
import { User } from 'src/database/entities/users.entity';
import { UserService } from '../user/user.service';

type PasswordOmitUser = Omit<User, 'password'>;

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseJwtStrategy) {
  constructor(private readonly _userService: UserService) {
    super({
      //Authorization headerからトークンを読み込む関数を返す
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //有効期間を無視するかどうか
      ignoreExpiration: false,
      //envファイルから秘密鍵を渡す
      secretOrKey: 'secret',
    });
  }

  //バリデーションを実行
  async validate(payload: { email: string }): Promise<PasswordOmitUser> {
    const user = await this._userService.findUser(payload.email);
    const { password, ...result } = user.user;
    return result;
  }
}
