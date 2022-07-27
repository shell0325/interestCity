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

  @Get()
  async getUsers(): Promise<CommonResponse> {
    let responseData: UsersResponseDto;

    responseData = await this._userService.getUsers();

    return new OkResponse(responseData);
  }

  @Post()
  async createUser(@Body() users: createUserRequestDto): Promise<CreatedResponse> {
    const responseData = await this._userService.createUser(users);

    return new CreatedResponse(responseData);
  }

  @Get('email')
  async findUser(@Param('email') email: string): Promise<OkResponse> {
    const responseData = await this._userService.findUser(email);

    return new OkResponse(responseData);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success',
    };
  }

  @Post('/certification')
  async certificationUser(@Body() certificationUser: certificationUserRequestDto) {
    const user = await this._userService.certificationUser(certificationUser);
    return user;
  }
}
