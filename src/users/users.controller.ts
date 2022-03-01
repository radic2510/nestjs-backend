import {Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiCookieAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {Users} from "../entities/user.entity";
import {User} from "../decorator/user.decorator";
import {LocalAuthGuard} from "../auth/local-auth.guard";
import {LoggedInGuard} from "../auth/logged-in.guard";
import {NotLoggedInGuard} from "../auth/not-logged-in.guard";

@ApiTags('USERS')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: Users) {
    return user;
  }

  @ApiCookieAuth('connect.sid')
  @ApiOperation( { summary: '로그아웃' })
  @UseGuards(LoggedInGuard)
  @Post('logout')
  async logout(@Res() res) {
    res.clearCookie('connect.sid', { httpOnly: true });
    return res.send('ok');
  }

  @ApiOperation({ summary: '회원가입' })
  @UseGuards(NotLoggedInGuard)
  @Post('join')
  async join(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @ApiOperation( { summary: '회원탈퇴' })
  @UseGuards(LoggedInGuard)
  @Delete('resign')
  async remove(@User() user: Users) {
    return this.usersService.remove(user);
  }

  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '내 정보 조회' })
  @UseGuards(LoggedInGuard)
  @Get()
  async getMyInfo(@User() user: Users) {
    return user || false;
  }

  @ApiOperation({ summary: '회원정보 수정' })
  @UseGuards(LoggedInGuard)
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

}
