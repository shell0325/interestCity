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
import { TagService } from './modules/tag/tag.service';
import { TagModule } from './modules/tag/tag.module';

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
  ],
  controllers: [AppController],
  providers: [AppService, TagService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
