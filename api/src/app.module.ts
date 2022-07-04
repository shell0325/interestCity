require('dotenv').config();
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChannelModule } from './modules/channel/channel.module';
import { GenreModule } from './modules/genre/genre.module';
import { TagModule } from './modules/tag/tag.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    UserModule,
    AuthModule,
    ChannelModule,
    GenreModule,
    TagModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,//email host
        port: parseInt(process.env.EMAIL_PORT!),// email port
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER, // user email address
          pass: process.env.EMAIL_PASS, // email password
        },
      },
      defaults: {
        from: '"nest-modules" <user@outlook.com>',
      },
      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
