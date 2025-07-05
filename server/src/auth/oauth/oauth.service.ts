import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/infra/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { CreateSignupOauthDto } from '../email-and-password-auth/validation';

@Injectable()
export class OauthService {
  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  async validateOAuthGoogleLogin(req): Promise<any> {
    if (!req || !req.user) {
      console.log('Google login failed:', req);
      throw new UnauthorizedException('No user from Google');
    }

    const auth = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      picture: req.user.picture,
    };

    let user = await this.userService.findUnique(auth.email);
    const dto: CreateSignupOauthDto = {
      name: auth.firstName + ' ' + auth.lastName,
      email: auth.email,
    };

    if (!user) {
      user = await this.userService.createOauth(dto);

      const data = {
        subject: 'BeatSync Inviation',
        username: user.name,
      };
      await this.mailService.sendWelcomeEmail(user.email, data);
    }

    const payload = { id: user.id, username: user.name, email: user.email };
    const token = await this.jwt.signAsync(payload);

    return {
      statusCode: HttpStatus.OK,
      message: 'Google Auth Successful',
      data: user,
      token: token,
    };
  }
}
