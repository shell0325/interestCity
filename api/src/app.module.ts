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
import { SendGridModule } from '@anchan828/nest-sendgrid';

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
    SendGridModule.forRoot({
      apikey: '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',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
