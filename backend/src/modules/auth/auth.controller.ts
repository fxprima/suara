import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserPayload } from './interfaces/user-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('signin')
  async login (
    @Body() loginDto: LoginDto, 
    @Req() req: Request, 
    @Res( {passthrough: true} ) res: Response
  ) {
    return this.authService.login(loginDto, req, res);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.refreshToken;
    if (!token)
      throw new UnauthorizedException("No refresh token provided");
    console.log("Call /refresh authcontroller - Refresh Token: ", token);

    return this.authService.refresh(token, res);
  }
  

  @Post('logout')
  async logout(@Body('refreshToken') token: string, @Res() res: Response) {
    return this.authService.logout(token, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: UserPayload) {
    console.log("dipanggil")
    return this.authService.me(user);
  }

}
