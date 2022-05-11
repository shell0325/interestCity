import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'local' }),

    //JWTを使うための設定
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          //envファイルから秘密鍵を渡す
          secret: 'secret',
          signOptions: {
            //有効期限を設定
            expiresIn: '1800s',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],

  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
