import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './../common/dto/user/register.dto';
import { LoginDto } from './../common/dto/user/login.dto';
import { RoleGuard } from '../common/role.guard';
import { Roles } from './../common/roles.decorator';
import { Public } from './../common/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  register(@Body() registerUserDto: RegisterDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @Public()
  login(@Body() loginUserDto: LoginDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('logout')
  async logout(@Headers('Authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new Error('Token not provided');
    }

    return this.authService.logout(token);
  }

  @UseGuards(RoleGuard)
  @Roles('admin')
  @Get('admin-only')
  adminAccess() {
    return { message: 'You have admin access!' };
  }
}
