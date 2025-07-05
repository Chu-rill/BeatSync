import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateLoginDto, CreateSignupDto, login, signup } from './validation';
import { ZodPipe } from '../../utils/schema-validation/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @UsePipes(new ZodPipe(signup))
  async signUp(@Body() dto: CreateSignupDto) {
    return this.userService.create(dto);
  }

  @Post('/login')
  @UsePipes(new ZodPipe(login))
  async login(@Body() dto: CreateLoginDto) {
    console.log({
      email: dto.email,
      password: dto.password,
    });
    return this.userService.login(dto);
  }
}
