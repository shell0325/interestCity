import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonResponse, CreatedResponse, OkResponse } from 'src/common/types/response';
import { UsersResponseDto } from './dto/users.response.dto';
import { createUserRequestDto } from './dto/create-user.request.dto';
import { Response } from 'express';
import { certificationUserRequestDto } from './dto/certification-user.request.dto';

@Controller('/user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  /**
   *全ユーザーデータを取得する
   * @returns 全ユーザーデータ
   */
  @Get()
  async getUsers(): Promise<CommonResponse> {
    let responseData: UsersResponseDto;

    responseData = await this._userService.getUsers();

    return new OkResponse(responseData);
  }

  /**
   *ユーザーを作成する
   * @param user 作成するユーザーデータ
   * @returns 作成後のユーザーデータ
   */
  @Post()
  async createUser(@Body() user: createUserRequestDto): Promise<CreatedResponse> {
    const responseData = await this._userService.createUser(user);

    return new CreatedResponse(responseData);
  }

  /**
   *ユーザーを検索する
   * @param email メールアドレス
   * @returns メールアドレスで検索したユーザーデータ
   */
  @Get('email')
  async findUser(@Param('email') email: string): Promise<OkResponse> {
    const responseData = await this._userService.findUser(email);

    return new OkResponse(responseData);
  }

  /**
   *ログアウトする
   * @param response ログアウトデータ
   * @returns ログアウト成功メッセージ
   */
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success',
    };
  }

  /**
   *ユーザーを本登録する
   * @param certificationUser 本登録するユーザーのデータ
   * @returns 本登録後のユーザーデータ
   */
  @Post('/certification')
  async certificationUser(@Body() certificationUser: certificationUserRequestDto) {
    const user = await this._userService.certificationUser(certificationUser);
    return user;
  }
}
