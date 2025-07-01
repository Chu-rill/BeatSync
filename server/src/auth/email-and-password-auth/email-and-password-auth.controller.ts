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
   return this.userService.create(dto)
  }

  @Post('/login')
  @UsePipes(new ZodPipe(login))
  async login(@Body() dto: CreateLoginDto) {
    const user = await this.userService.validateUser(dto.email, dto.password);
    if (!user) {
      return {
        statusCode: 401,
        message: 'Invalid email or password',
        data: null,
      };
    }
    // (Optional: generate JWT here)
    return {
      statusCode: 200,
      message: 'Login successful',
      data: {
        id: (user as any)._id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
